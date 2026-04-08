import { useState, useCallback, useRef } from 'react'
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api'
import { MapPin, Navigation, Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/Button'
import { Spinner } from '../ui/Spinner'

// Default center (Egypt)
const DEFAULT_CENTER = { lat: 30.0444, lng: 31.2357 }
const DEFAULT_ZOOM = 15

// Dark map style
const mapContainerStyle = {
    width: '100%',
    height: '100%',
}

const darkMapStyles = [
    { elementType: 'geometry', stylers: [{ color: '#1d1d1d' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#1d1d1d' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#8a8a8a' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2c2c2c' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1d1d1d' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3a3a3a' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e2530' }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#252525' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#263c28' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#252525' }] },
]

const libraries = ['places']

/**
 * Interactive map component with location selection.
 */
export function LocationMap({
    apiKey,
    currentLocation,
    onLocationSelect,
    selectedLocation,
    searchQuery,
    onSearchChange,
    pickupLocation,
    deliveryLocation,
    selectionMode,
}) {
    const [map, setMap] = useState(null)
    const [searchBox, setSearchBox] = useState(null)
    const [places, setPlaces] = useState([])
    const [showSearchResults, setShowSearchResults] = useState(false)
    const searchInputRef = useRef(null)

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey || '',
        libraries,
    })

    const onLoad = useCallback((mapInstance) => {
        setMap(mapInstance)
    }, [])

    const onUnmount = useCallback(() => {
        setMap(null)
    }, [])

    const handleMapClick = useCallback((event) => {
        const lat = event.latLng.lat()
        const lng = event.latLng.lng()
        onLocationSelect({ lat, lng, address: 'موقع مخصص' })
    }, [onLocationSelect])

    const handleSearch = async () => {
        if (!map || !searchQuery) return

        const service = new window.google.maps.places.PlacesService(map)
        const request = {
            query: searchQuery,
            fields: ['name', 'formatted_address', 'geometry'],
        }

        service.textSearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                setPlaces(results.slice(0, 5))
                setShowSearchResults(true)
            }
        })
    }

    const handlePlaceSelect = (place) => {
        const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: place.formatted_address,
            name: place.name,
        }
        onLocationSelect(location)
        map?.panTo(place.geometry.location)
        setShowSearchResults(false)
        onSearchChange('')
    }

    const center = selectedLocation || currentLocation || DEFAULT_CENTER

    if (loadError) {
        return (
            <div className="h-full flex items-center justify-center bg-[var(--bg-surface)]">
                <div className="text-center p-6">
                    <MapPin className="text-gold mx-auto mb-4" size={48} />
                    <p className="text-[var(--text-primary)] font-bold mb-2">خطأ في تحميل الخريطة</p>
                    <p className="text-[var(--text-muted)] text-sm">تأكد من إضافة مفتاح Google Maps API</p>
                </div>
            </div>
        )
    }

    if (!isLoaded) {
        return (
            <div className="h-full flex items-center justify-center bg-[var(--bg-surface)]">
                <div className="text-center">
                    <Spinner size="lg" />
                    <p className="text-[var(--text-muted)] mt-4">جاري تحميل الخريطة...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="relative h-full w-full">
            {/* Search Box */}
            <div className="absolute top-4 left-4 right-4 z-10">
                <div className="relative">
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="ابحث عن موقع..."
                                className="w-full pr-12 pl-4 py-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-gold focus:ring-1 focus:ring-gold outline-none shadow-lg"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => {
                                        onSearchChange('')
                                        setShowSearchResults(false)
                                    }}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                        <Button onClick={handleSearch} className="!px-4">
                            بحث
                        </Button>
                    </div>

                    {/* Search Results Dropdown */}
                    <AnimatePresence>
                        {showSearchResults && places.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl shadow-xl overflow-hidden z-20"
                            >
                                {places.map((place, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePlaceSelect(place)}
                                        className="w-full p-4 text-right hover:bg-[var(--bg-elevated)] transition border-b border-[var(--border-subtle)] last:border-0"
                                    >
                                        <p className="font-bold text-[var(--text-primary)] text-sm">{place.name}</p>
                                        <p className="text-xs text-[var(--text-muted)] mt-1">{place.formatted_address}</p>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Google Map */}
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={DEFAULT_ZOOM}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={handleMapClick}
                options={{
                    styles: darkMapStyles,
                    disableDefaultUI: true,
                    zoomControl: true,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                }}
            >
                {/* Current Location Circle */}
                {currentLocation && !selectedLocation && (
                    <Circle
                        center={currentLocation}
                        radius={100}
                        options={{
                            strokeColor: '#C9A84C',
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: '#C9A84C',
                            fillOpacity: 0.2,
                        }}
                    />
                )}

                {/* Current Location Marker */}
                {currentLocation && (
                    <Marker
                        position={currentLocation}
                        icon={{
                            path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                            scale: 10,
                            fillColor: '#C9A84C',
                            fillOpacity: 1,
                            strokeColor: '#fff',
                            strokeWeight: 3,
                        }}
                    />
                )}

                {/* Selected Location Marker */}
                {selectedLocation && (
                    <Marker
                        position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                        icon={{
                            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#C9A84C" stroke="#fff" stroke-width="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                    <circle cx="12" cy="10" r="3" fill="#fff"/>
                                </svg>
                            `),
                            scaledSize: new window.google.maps.Size(40, 40),
                            anchor: new window.google.maps.Point(20, 40),
                        }}
                    />
                )}

                {/* Pickup Marker */}
                {pickupLocation && (
                    <Marker
                        position={{ lat: pickupLocation.lat, lng: pickupLocation.lng }}
                        label={{
                            text: 'A',
                            color: '#fff',
                            fontWeight: 'bold',
                        }}
                    />
                )}

                {/* Delivery Marker */}
                {deliveryLocation && (
                    <Marker
                        position={{ lat: deliveryLocation.lat, lng: deliveryLocation.lng }}
                        label={{
                            text: 'B',
                            color: '#fff',
                            fontWeight: 'bold',
                        }}
                    />
                )}
            </GoogleMap>

            {/* Center on current location button */}
            {currentLocation && (
                <button
                    onClick={() => map?.panTo(currentLocation)}
                    className="absolute bottom-6 left-4 w-12 h-12 rounded-full bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-lg flex items-center justify-center hover:bg-[var(--bg-elevated)] transition"
                >
                    <Navigation className="text-gold" size={20} />
                </button>
            )}
        </div>
    )
}