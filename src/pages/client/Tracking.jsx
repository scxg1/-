import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { ScreenWrapper } from '../../components/layout/ScreenWrapper'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { SimulatedMap } from '../../components/tracking/SimulatedMap'
import { StatusTimeline } from '../../components/tracking/StatusTimeline'
import { CourierInfo } from '../../components/tracking/CourierInfo'
import { ETACountdown } from '../../components/tracking/ETACountdown'
import { StarRating } from '../../components/forms/StarRating'
import { useOrders } from '../../hooks/useOrders'
import { ORDER_STATUS } from '../../constants'

/**
 * Order tracking page with real-time updates.
 */
export default function Tracking() {
    const { orderId } = useParams()
    const navigate = useNavigate()
    const { activeOrder, fetchMyOrders, subscribeToOrder, cancelOrder, submitRating } = useOrders()
 const [rating, setRating] = useState(0)
    const [showRating, setShowRating] = useState(false)

    useEffect(() => {
        fetchMyOrders()
    }, [fetchMyOrders])

    useEffect(() => {
        if (orderId) {
            const cleanup = subscribeToOrder(orderId, (updated) => {
                if (updated.status === ORDER_STATUS.DELIVERED) setShowRating(true)
            })
            return cleanup
        }
    }, [orderId, subscribeToOrder])

    const order = activeOrder
    const canCancel = order?.status === ORDER_STATUS.PENDING || order?.status === ORDER_STATUS.SEARCHING

    const handleRate = async () => {
        if (rating > 0) {
            await submitRating(orderId, rating)
            setShowRating(false)
        }
    }

    return (
        <ScreenWrapper>
            <TopBar title="تتبع الطلب" />

            <div className="px-4 py-6 max-w-lg mx-auto space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <button onClick={() => navigate(-1)} className="text-[var(--text-secondary)]">
                        <ArrowRight size={20} />
                    </button>
                    <h1 className="text-lg font-bold">تتبع الطلب</h1>
                </div>

                {order ? (
                    <>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-[var(--text-muted)] font-mono">{order.order_number}</span>
                            <Badge status={order.status} />
                        </div>

                        <SimulatedMap />
                        <ETACountdown />
                        <CourierInfo />
                        <StatusTimeline currentStatus={order.status} orderType={order.type} />

                        {canCancel && (
                            <Button variant="danger" fullWidth onClick={() => cancelOrder(orderId)}>
                                إلغاء الطلب
                            </Button>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-[var(--text-muted)]">جارٍ تحميل بيانات الطلب...</p>
                    </div>
                )}
            </div>

            {/* Rating overlay */}
            <AnimatePresence>
                {showRating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="bg-[var(--bg-surface)] rounded-2xl p-6 text-center max-w-sm w-full"
                        >
                            <div className="text-4xl mb-3">✅</div>
                            <h3 className="text-lg font-bold mb-2">تم التوصيل بنجاح!</h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-4">كيف كان طلبك؟</p>
                            <StarRating value={rating} onChange={setRating} size={32} className="justify-center" />
                            <div className="flex gap-3 mt-6">
                                <Button variant="gold" fullWidth onClick={handleRate} disabled={rating === 0}>
                                    إرسال التقييم
                                </Button>
                                <Button variant="ghost" fullWidth onClick={() => setShowRating(false)}>
                                    لاحقاً
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </ScreenWrapper>
    )
}