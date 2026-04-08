import { motion } from 'framer-motion'

/**
 * Toggle switch component.
 * @param {{ enabled: boolean, onChange: function, label?: string, className?: string }} props
 */
export function Toggle({ enabled, onChange, label, className = '' }) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {label && (
                <span className="text-sm text-[var(--text-secondary)]">{label}</span>
            )}
            <button
                type="button"
                onClick={() => onChange(!enabled)}
                className={`
          relative w-12 h-6 rounded-full transition-colors duration-200
          ${enabled ? 'bg-gold' : 'bg-[var(--bg-overlay)]'}
        `}
            >
                <motion.div
                    layout
                    className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow"
                    animate={{ left: enabled ? '26px' : '2px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
            </button>
        </div>
    )
}