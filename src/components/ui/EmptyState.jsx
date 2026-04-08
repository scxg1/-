import { Package } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * Empty state placeholder component.
 * @param {{ icon?: React.ReactNode, title: string, description?: string,
 *           action?: React.ReactNode, className?: string }} props
 */
export function EmptyState({ icon, title, description, action, className = '' }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col items-center justify-center py-12 text-center ${className}`}
        >
            <div className="text-[var(--text-muted)] mb-4">
                {icon || <Package size={48} />}
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-[var(--text-secondary)] max-w-xs">{description}</p>
            )}
            {action && <div className="mt-4">{action}</div>}
        </motion.div>
    )
}