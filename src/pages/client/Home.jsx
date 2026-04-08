import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Navigation, Search, ShoppingBag, Package } from 'lucide-react'
import { ScreenWrapper } from '../../components/layout/ScreenWrapper'
import { TopBar } from '../../components/layout/TopBar'
import { BottomNav } from '../../components/layout/BottomNav'
import { ActiveOrderBanner } from '../../components/orders/ActiveOrderBanner'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import { useOrders } from '../../hooks/useOrders'
import { useGeolocation } from '../../hooks/useGeolocation'
import { useToast } from '../../hooks/useToast'
import { LocationMap } from '../../components/map/LocationMap'
import { AddressSelectionModal } from '../../components/map/AddressSelectionModal'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

/**
 * Client home page with map and location selection
 */
export default function Home() {
    const navigate = useNavigate()
    const { orders, activeOrder, fetchMyOrders } = useOrders()
    const { location: currentLocation, loading: locationLoading, error: locationError, requestPermission } = useGeolocation()
    const { showToast } = useToast()

    const [showMap, setShowMap] = useState(false)
    const [showAddressModal, setShowAddressModal] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [pickupLocation, setPickupLocation] = useState(null)
    const [deliveryLocation, setDeliveryLocation] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchMyOrders()
    }, [fetchMyOrders])

    useEffect(() => {
        if (currentLocation) {
            setShowMap(true)
        }
    }, [currentLocation])

    const handleLocationSelect = (location) => {
        setSelectedLocation(location)
        setShowAddressModal(true)
    }

    const handleSelectPickup = (location) => {
        setPickupLocation(location)
        setShowAddressModal(false)
        setSelectedLocation(null)
        showToast('تم تحديد موقع الاستلام', 'success')
    }

    const handleSelectDelivery = (location) => {
        setDeliveryLocation(location)
        setShowAddressModal(false)
        setSelectedLocation(null)
        showToast('تم تحديد موقع التوصيل', 'success')
    }

    const handleConfirmAddresses = () => {
        if (pickupLocation && deliveryLocation) {
            navigate('/order/new/b', {
                state: {
                    pickupLocation,
                    deliveryLocation
                }
            })
        }
    }

    const recentOrders = orders?.slice(0, 3) || []

    return (
        <ScreenWrapper className="pb-20">
            <TopBar />

            {/* Map Section */}
            <div className="relative h-[50vh] min-h-[400px]">
                {locationLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-surface)]">
                        <div className="text-center">
                            <Spinner size="lg" />
                            <p className="text-[var(--text-muted)] mt-4">جاري تحديد موقعك...</p>
                        </div>
                    </div>
                )}

                {locationError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-surface)]">
                        <div className="text-center p-6">
                            <MapPin className="text-gold mx-auto mb-4" size={48} />
                            <p className="text-[var(--text-primary)] font-bold mb-2">لم نتمكن من تحديد موقعك</p>
                            <p className="text-[var(--text-muted)] text-sm mb-4">{locationError}</p>
                            <Button onClick={requestPermission}>
                                <Navigation size={18} className="ml-2" />
                                إعادة المحاولة
                            </Button>
                        </div>
                    </div>
                )}

                {showMap && currentLocation && (
                    <LocationMap
                        apiKey={GOOGLE_MAPS_API_KEY}
                        currentLocation={currentLocation}
                        selectedLocation={selectedLocation}
                        onLocationSelect={handleLocationSelect}
                        pickupLocation={pickupLocation}
                        deliveryLocation={deliveryLocation}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                    />
                )}

                {/* Search overlay when no API key */}
                {!GOOGLE_MAPS_API_KEY && showMap && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-surface)]/90">
                        <div className="text-center p-6 max-w-sm">
                            <Search className="text-gold mx-auto mb-4" size={48} />
                            <p className="text-[var(--text-primary)] font-bold mb-2">البحث غير متاح</p>
                            <p className="text-[var(--text-muted)] text-sm">
                                أضف مفتاح Google Maps API في ملف .env لتفعيل البحث
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Sheet Content */}
            <div className="relative -mt-8 bg-[var(--bg-base)] rounded-t-3xl min-h-[50vh] px-4 pt-6 pb-4">
                {/* Active order banner */}
                {activeOrder && (
                    <div className="mb-4">
                        <ActiveOrderBanner order={activeOrder} />
                    </div>
                )}

                {/* Selected addresses summary */}
                {(pickupLocation || deliveryLocation) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-4 rounded-xl glass"
                    >
                        <p className="text-sm text-[var(--text-muted)] mb-3">العناوين المحددة:</p>

                        {pickupLocation && (
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-6 h-6 rounded-full bg-gold text-black flex items-center justify-center text-xs font-bold">A</span>
                                <span className="text-sm text-[var(--text-primary)] truncate">{pickupLocation.address}</span>
                            </div>
                        )}

                        {deliveryLocation && (
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-6 h-6 rounded-full bg-gold text-black flex items-center justify-center text-xs font-bold">B</span>
                                <span className="text-sm text-[var(--text-primary)] truncate">{deliveryLocation.address}</span>
                            </div>
                        )}

                        {pickupLocation && deliveryLocation && (
                            <Button onClick={handleConfirmAddresses} fullWidth size="sm">
                                متابعة الطلب
                            </Button>
                        )}
                    </motion.div>
                )}

                {/* Service Cards */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                        onClick={() => navigate('/order/new/a')}
                        className="glass rounded-2xl p-5 text-center hover:border-gold/30 transition"
                    >
                        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-3">
                            <ShoppingBag className="text-gold" size={24} />
                        </div>
                        <p className="font-bold text-[var(--text-primary)] text-sm">اطلب لي</p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">اطلب من أي محل</p>
                    </button>

                    <button
                        onClick={() => navigate('/order/new/b')}
                        className="glass rounded-2xl p-5 text-center hover:border-gold/30 transition"
                    >
                        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-3">
                            <Package className="text-gold" size={24} />
                        </div>
                        <p className="font-bold text-[var(--text-primary)] text-sm">وصّل عني</p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">أرسل أي طرد</p>
                    </button>
                </div>

                {/* Recent Orders */}
                {recentOrders.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-[var(--text-primary)]">آخر الطلبات</h3>
                            <button
                                onClick={() => navigate('/orders')}
                                className="text-gold text-sm font-bold hover:underline"
                            >
                                عرض الكل ←
                            </button>
                        </div>
                        <div className="space-y-3">
                            {recentOrders.map(order => (
                                <div key={order.id} className="glass rounded-xl p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-[var(--text-primary)] text-sm">
                                                {order.store_name || order.order_number}
                                            </p>
                                            <p className="text-xs text-[var(--text-muted)]">
                                                {order.delivery_address}
                                            </p>
                                        </div>
                                        <span className="text-gold font-bold text-sm">
                                            {order.total_client_pays} ج.م
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Address Selection Modal */}
            <AddressSelectionModal
                isOpen={showAddressModal}
                onClose={() => setShowAddressModal(false)}
                selectedLocation={selectedLocation}
                pickupLocation={pickupLocation}
                deliveryLocation={deliveryLocation}
                onSelectPickup={handleSelectPickup}
                onSelectDelivery={handleSelectDelivery}
                onConfirm={handleConfirmAddresses}
            />

            <BottomNav />
        </ScreenWrapper>
    )
}