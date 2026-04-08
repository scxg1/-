import { motion } from 'framer-motion'
import { STATUS_LABELS } from '../../constants'

const STATUS_COLORS = {
    pending: 'bg-gray-500/20 text-gray-400',
    searching: 'bg-gray-500/20 text-gray-400',
    assigned: 'bg-blue-500/20 text-blue-400',
    heading_to_store: 'bg-blue-500/20 text-blue-400',
    heading_to_client: 'bg-blue-500/20 text-blue-400',
    heading_to_destination: 'bg-blue-500/20 text-blue-400',
    at_store: 'bg-amber-500/20 text-amber-400',
    at_client: 'bg-amber-500/20 text-amber-400',
    purchased: 'bg-amber-500/20 text-amber-400',
    picked_up: 'bg-amber-500/20 text-amber-400',
    delivered: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-red-500/20 text-red-400',
}

const ACTIVE_STATUSES = ['searching', 'assigned', 'heading_to_store', 'heading_to_client', 'heading_to_destination']

/**
 * Status badge with color coding and optional pulse animation.
 * @param {{ status: string, label?: string, className?: string }} props
 */
export function Badge({ status, label, className = '' }) {
    const displayLabel = label || STATUS_LABELS[status] || status
    const isActive = ACTIVE_STATUSES.includes(status)

    return (
        <motion.span
            animate={isActive ? { opacity: [1, 0.5, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`
        inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
        ${STATUS_COLORS[status] || 'bg-gray-500/20 text-gray-400'}
        ${className}
      `}
        >
            {displayLabel}
        </motion.span>
    )
}
