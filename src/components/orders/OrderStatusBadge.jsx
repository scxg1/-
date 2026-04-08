import { Badge } from '../ui/Badge'

/**
 * Wrapper for Badge with order-specific styling.
 * @param {{ status: string, className?: string }} props
 */
export function OrderStatusBadge({ status, className = '' }) {
    return <Badge status={status} className={className} />
}