import { useNavigate } from 'react-router-dom'
import { Badge } from '../ui/Badge'
import { ArrowLeft } from 'lucide-react'

/**
 * Banner showing the currently active order with real-time status.
 * @param {{ order: object }} props
 */
export function ActiveOrderBanner({ order }) {
    const navigate = useNavigate()

    if (!order) return null

    return (
        <div
            onClick={() => navigate(`/tracking/${order.id}`)}
            className="border border-gold/30 bg-gold/5 rounded-2xl p-4 cursor-pointer hover:bg-gold/10 transition-colors"
        >
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--text-muted)]">{order.order_number}</span>
                <Badge status={order.status} />
            </div>
            <p className="text-sm font-bold text-[var(--text-primary)]">
                {order.type === 'order_for_me' ? order.store_name : order.package_description}
            </p>
            <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-[var(--text-secondary)]">
                    {order.pickup_address} ← {order.delivery_address}
                </span>
                <span className="text-gold text-sm font-bold flex items-center gap-1">
                    تتبع الطلب
                    <ArrowLeft size={14} />
                </span>
            </div>
        </div>
    )
}