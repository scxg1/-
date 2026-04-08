import { useState, useEffect } from 'react'

/**
 * Hook to get user's current geolocation.
 * @returns {{ location: object|null, loading: boolean, error: string|null, requestPermission: function }}
 */
export function useGeolocation() {
    const [location, setLocation] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const requestPermission = () => {
        if (!navigator.geolocation) {
            setError('المتصفح لا يدعم تحديد الموقع')
            return
        }

        setLoading(true)
        setError(null)

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                })
                setLoading(false)
            },
            (err) => {
                let errorMessage = 'فشل في تحديد الموقع'
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        errorMessage = 'تم رفض إذن الوصول للموقع'
                        break
                    case err.POSITION_UNAVAILABLE:
                        errorMessage = 'الموقع غير متاح'
                        break
                    case err.TIMEOUT:
                        errorMessage = 'انتهت مهلة طلب الموقع'
                        break
                }
                setError(errorMessage)
                setLoading(false)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        )
    }

    useEffect(() => {
        // Auto-request permission on mount
        requestPermission()
    }, [])

    return {
        location,
        loading,
        error,
        requestPermission,
    }
}