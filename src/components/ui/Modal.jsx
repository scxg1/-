import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

/**
 * Modal dialog with backdrop and animation.
 * @param {{ isOpen: boolean, onClose: function, title?: string,
 *           children: React.ReactNode, className?: string }} props
 */
export function Modal({ isOpen, onClose, title, children, className = '' }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className={`
              relative w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-default)]
              rounded-2xl p-6 z-10 max-h-[90vh] overflow-y-auto
              ${className}
            `}
                    >
                        <div className="flex items-center justify-between mb-4">
                            {title && <h3 className="text-lg font-bold text-[var(--text-primary)]">{title}</h3>}
                            <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                                <X size={20} />
                            </button>
                        </div>
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}