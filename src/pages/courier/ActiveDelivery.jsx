import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, MapPin, User, Phone, FileText } from 'lucide-react'
import { ScreenWrapper } from '../../components/layout/ScreenWrapper'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { useCourier } from '../../hooks/useCourier'
import { useToast } from '../../hooks/useToast'
import { formatCurrency } from '../../utils/formatters'
import { ORDER_STATUS, ORDER_TYPES } from '../../constants'

const STEPS_ORDER_FOR_ME = [
    { status: ORDER_STATUS.HEADING_TO_STORE, label: 'توجهت للمحل' },
    { status: ORDER_STATUS.AT_STORE, label: 'وصلت للمحل' },
    { status: ORDER_STATUS.PURCHASED, label: 'اشتريت الطلب' },
    { status: ORDER_STATUS.HEADING_TO_CLIENT, label: 'توجهت للعميل' },
    { status: ORDER_STATUS.AT_CLIENT, label: 'وصلت للعميل' },
    { status: ORDER_STATUS.DELIVERED, label: 'سلّمت الطلب ✅' },
]

const STEPS_SEND_FOR_ME = [
    { status: ORDER_STATUS.HEADING_TO_CLIENT, label: 'توجهت للعميل' },
    { status: ORDER_STATUS.AT_CLIENT, label: 'وصلت للعميل' },
    { status: ORDER_STATUS.PICKED_UP, label: 'استلمت الطرد' },
    { status: ORDER_STATUS.HEADING_TO_DESTINATION, label: 'توجهت للوجهة' },
    { status: ORDER_STATUS.DELIVERED, label: 'سلّمت الطرد ✅' },
]

/**
 * Active delivery page for courier — shows order details and status update buttons.
 */
export default function ActiveDelivery() {
    const navigate = useNavigate()
    const { activeOrder, fetchActiveOrder, updateOrderStatus } = useCourier()
    const { showToast } = useToast()

    useEffect(() => {
        fetchActiveOrder()
    }, [fetchActiveOrder])

    if (!activeOrder) {
        return (
            <ScreenWrapper>
                <div className="px-4 py-6 max-w-lg mx-auto text-center py-20">
                    <p className="text-[var(--text-muted)] mb-4">لا يوجد طلب نشط</p>
                    <Button onClick={() => navigate('/courier')}>العودة للرئيسية</Button>
                </div>
            </ScreenWrapper>
        )
    }

    const steps = activeOrder.type === ORDER_TYPES.ORDER_FOR_ME
        ? STEPS_ORDER_FOR_ME
        : STEPS_SEND_FOR_ME

    const currentStepIndex = steps.findIndex((s) => s.status === activeOrder.status)
    const nextSteps = steps.slice(Math.max(currentStepIndex + 1, 0))

    const handleUpdate = async (newStatus) => {
        await updateOrderStatus(activeOrder.id, newStatus)
        if (newStatus === ORDER_STATUS.DELIVERED) {
            navigate('/courier')
        }
    }

    return (
        <ScreenWrapper>
            <div className="px-4 py-6 max-w-lg mx-auto space-y-4">
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                    <button onClick={() => navigate('/courier')} className="text-[var(--text-secondary)]">
                        <ArrowRight size={20} />
                    </button>
                    <h1 className="text-lg font-bold">التوصيل النشط</h1>
                </div>

                {/* Order info card */}
                <div className="glass rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-[var(--text-muted)]">{activeOrder.order_number}</span>
                        <Badge status={activeOrder.status} />
                    </div>

                    <div className="text-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin size={14} className="text-gold" />
                            <span className="text-[var(--text-secondary)]">الاستلام:</span>
                            <span className="text-[var(--text-primary)]">{activeOrder.pickup_address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-green-400" />
                            <span className="text-[var(--text-secondary)]">التسليم:</span>
                            <span className="text-[var(--text-primary)]">{activeOrder.delivery_address}</span>
                        </div>
                    </div>

                    {activeOrder.notes && (
                        <div className="flex items-start gap-2 text-xs text-[var(--text-muted)] bg-[var(--bg-elevated)] p-3 rounded-lg">
                            <FileText size={14} className="shrink-0 mt-0.5" />
                            <span>{activeOrder.notes}</span>
                        </div>
                    )}

                    {activeOrder.recipient_name && (
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <User size={14} className="text-[var(--text-muted)]" />
                                <span>{activeOrder.recipient_name}</span>
                            </div>
                            {activeOrder.recipient_phone && (
                                <div className="flex items-center gap-1">
                                    <Phone size={14} className="text-[var(--text-muted)]" />
                                    <span>{activeOrder.recipient_phone}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="pt-2 border-t border-[var(--border-subtle)]">
                        <p className="text-sm text-[var(--text-secondary)]">
                            أرباحك: <span className="font-bold text-gold">{formatCurrency(activeOrder.courier_earning)}</span>
                        </p>
                    </div>
                </div>

                {/* Status update buttons */}
                <div className="space-y-2">
                    <h3 className="font-bold text-sm text-[var(--text-muted)]">تحديث الحالة</h3>
                    {nextSteps.map((step) => (
                        <Button
                            key={step.status}
                            variant={step.status === ORDER_STATUS.DELIVERED ? 'gold' : 'outline'}
                            fullWidth
                            onClick={() => handleUpdate(step.status)}
                        >
                            {step.label}
                        </Button>
                    ))}
                </div>
            </div>
        </ScreenWrapper>
    )
}