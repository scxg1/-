import { useNavigate } from 'react-router-dom'
import { Badge } from '../ui/Badge'
import { formatCurrency, formatRelativeTime } from '../../utils/formatters'
import { MapPin, Clock } from 'lucide-react'
import { isOrderActive } from '../../utils/orderUtils'

/**
 * Order card for the orders list page.
 * @param {{ order: object, onRate?: function }} props
 */
export function OrderCard({ order, onRate }) {
    const navigate = useNavigate()
    const isActive = isOrderActive(order.status)

    const borderColor = isActive
        ? 'border-r-4 border-r-gold'
        : order.status === 'delivered'
            ? 'border-r-4 border-r-green-500'
            : 'border-r-4 border-r-red-500'

    return (
        <div
            className={`glass rounded-xl p-4 ${borderColor} ${isActive ? 'cursor-pointer' : ''}`}
            onClick={() => isActive && navigate(`/tracking/${order.id}`)}
        >
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--text-muted)] font-mono">{order.order_number}</span>
                <Badge status={order.status} />
            </div>

            <p className="font-bold text-[var(--text-primary)] text-sm mb-1">
                {order.type === 'order_for_me' ? order.store_name : order.package_description}
            </p>

            <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)] mb-1">
                <MapPin size={12} />
                <span>{order.delivery_address}</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)] mb-2">
                <Clock size={12} />
                <span>{formatRelativeTime(order.created_at)}</span>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gold">
                    {formatCurrency(order.total_client_pays)}
                </span>
                {order.status === 'delivered' && !order.rating && onRate && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onRate(order.id) }}
                        className="text-xs text-gold hover:underline"
                    >
                        قيّم الطلب ⭐
                    </button>
                )}
            </div>
        </div>
    )
}