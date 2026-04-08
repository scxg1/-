import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Power, MapPin, Clock, TrendingUp, Star, ShoppingBag, Package } from 'lucide-react'
import { ScreenWrapper } from '../../components/layout/ScreenWrapper'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Spinner } from '../../components/ui/Spinner'
import { useCourier } from '../../hooks/useCourier'
import { formatCurrency } from '../../utils/formatters'
import { ORDER_TYPES, ORDER_EXPIRY_SECONDS } from '../../constants'

/**
 * Courier home — online toggle, stats, and pending orders.
 */
export default function CourierHome() {
    const navigate = useNavigate()
    const {
        stats, pendingOrders, activeOrder, loading,
        toggleOnline, acceptOrder, fetchPendingOrders, fetchMyStats, fetchActiveOrder,
    } = useCourier()

    useEffect(() => {
        fetchMyStats()
        fetchActiveOrder()
    }, [fetchMyStats, fetchActiveOrder])

    const isOnline = stats?.is_online || false

    const handleToggle = () => toggleOnline(!isOnline)

    useEffect(() => {
        if (isOnline) fetchPendingOrders()
    }, [isOnline, fetchPendingOrders])

    return (
        <ScreenWrapper>
            <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-[var(--text-primary)]">لوحة المندوب</h1>
                        <p className="text-sm text-[var(--text-secondary)]">إدارة طلباتك وأرباحك</p>
                    </div>
                    <Button variant={isOnline ? 'gold' : 'outline'} size="sm" onClick={handleToggle}>
                        <Power size={14} />
                        {isOnline ? 'متاح' : 'غير متاح'}
                    </Button>
                </div>

                {/* Stats card */}
                {stats && (
                    <div className="bg-gold-gradient rounded-2xl p-5 text-black">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-lg font-extrabold">{formatCurrency(stats.total_earned)}</p>
                                <p className="text-xs opacity-70">أرباح اليوم</p>
                            </div>
                            <div>
                                <p className="text-lg font-extrabold">{stats.completed_orders}</p>
                                <p className="text-xs opacity-70">طلبات مكتملة</p>
                            </div>
                            <div>
                                <p className="text-lg font-extrabold flex items-center justify-center gap-1">
                                    <Star size={14} fill="currentColor" />
                                    {stats.rating_count > 0 ? (stats.rating_sum / stats.rating_count).toFixed(1) : '—'}
                                </p>
                                <p className="text-xs opacity-70">تقييمك</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Active order */}
                {activeOrder && (
                    <div
                        onClick={() => navigate('/courier/delivery')}
                        className="border border-gold/30 bg-gold/5 rounded-2xl p-4 cursor-pointer"
                    >
                        <p className="text-sm font-bold text-gold mb-1">طلب نشط</p>
                        <p className="text-sm text-[var(--text-primary)]">
                            {activeOrder.type === ORDER_TYPES.ORDER_FOR_ME ? activeOrder.store_name : activeOrder.package_description}
                        </p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">{activeOrder.delivery_address}</p>
                        <Button size="sm" className="mt-3">استمرار التوصيل</Button>
                    </div>
                )}

                {/* Pending orders */}
                {isOnline && (
                    <div>
                        <h3 className="font-bold text-[var(--text-primary)] mb-3">الطلبات المتاحة</h3>
                        {loading ? (
                            <div className="flex justify-center py-8"><Spinner /></div>
                        ) : pendingOrders.length > 0 ? (
                            <div className="space-y-3">
                                {pendingOrders.map((order) => (
                                    <PendingOrderCard
                                        key={order.id}
                                        order={order}
                                        onAccept={() => acceptOrder(order.id)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-sm text-[var(--text-muted)] py-8">
                                لا يوجد طلبات حالياً — ابقَ متاحاً
                            </p>
                        )}
                    </div>
                )}
            </div>
        </ScreenWrapper>
    )
}

function PendingOrderCard({ order, onAccept }) {
    const [seconds, setSeconds] = useState(ORDER_EXPIRY_SECONDS)

    useEffect(() => {
        if (seconds <= 0) return
        const timer = setInterval(() => setSeconds((s) => s - 1), 1000)
        return () => clearInterval(timer)
    }, [seconds])

    const progress = seconds / ORDER_EXPIRY_SECONDS

    return (
        <motion.div
            animate={seconds <= 0 ? { opacity: 0.3 } : {}}
            className="glass rounded-xl p-4"
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    {order.type === ORDER_TYPES.ORDER_FOR_ME ? (
                        <ShoppingBag size={14} className="text-gold" />
                    ) : (
                        <Package size={14} className="text-gold" />
                    )}
                    <span className="text-xs text-[var(--text-muted)]">
                        {order.type === ORDER_TYPES.ORDER_FOR_ME ? 'اطلب لي' : 'وصّل عني'}
                    </span>
                </div>
                <span className="text-xs text-[var(--text-muted)] font-mono">{seconds}s</span>
            </div>

            <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)] mb-1">
                <MapPin size={12} />
                <span>{order.pickup_address}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)] mb-2">
                <MapPin size={12} />
                <span>{order.delivery_address}</span>
            </div>

            <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-gold">+{formatCurrency(order.courier_earning)}</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-[var(--bg-overlay)] rounded-full mb-3">
                <div
                    className="h-full bg-gold rounded-full transition-all duration-1000"
                    style={{ width: `${progress * 100}%` }}
                />
            </div>

            <div className="flex gap-2">
                <Button size="sm" variant="gold" fullWidth onClick={onAccept} disabled={seconds <= 0}>
                    قبول
                </Button>
                <Button size="sm" variant="ghost" fullWidth>
                    تجاهل
                </Button>
            </div>
        </motion.div>
    )
}