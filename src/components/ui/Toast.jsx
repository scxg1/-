import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react'
import useStore from '../../store/useStore'

const TOAST_STYLES = {
    success: { icon: CheckCircle, border: 'border-l-green-500', bg: 'bg-green-500/10' },
    error: { icon: XCircle, border: 'border-l-red-500', bg: 'bg-red-500/10' },
    info: { icon: Info, border: 'border-l-gold', bg: 'bg-gold/10' },
    warning: { icon: AlertTriangle, border: 'border-l-amber-500', bg: 'bg-amber-500/10' },
}

/**
 * Global toast notification overlay.
 * Reads from Zustand store, auto-dismisses.
 */
export function Toast() {
    const toast = useStore((s) => s.toast)
    const hideToast = useStore((s) => s.hideToast)

    return (
        <AnimatePresence>
            {toast && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    onClick={hideToast}
                    className={`
            fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]
            flex items-center gap-3 px-5 py-3 rounded-xl
            border-l-4 ${TOAST_STYLES[toast.type]?.border || ''}
            ${TOAST_STYLES[toast.type]?.bg || ''}
            bg-[var(--bg-surface)] shadow-xl cursor-pointer
            min-w-[280px] max-w-[90vw]
          `}
                >
                    {(() => {
                        const IconComp = TOAST_STYLES[toast.type]?.icon || Info
                        return <IconComp size={20} className="shrink-0" />
                    })()}
                    <p className="text-sm text-[var(--text-primary)] font-medium">{toast.message}</p>
                </motion.div>
            )}
        </AnimatePresence>
    )
}