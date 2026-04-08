import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { getStatusSteps } from '../../utils/orderUtils'
import { STATUS_LABELS } from '../../constants'

/**
 * Vertical timeline showing order status progression.
 * @param {{ currentStatus: string, orderType: string }} props
 */
export function StatusTimeline({ currentStatus, orderType }) {
    const steps = getStatusSteps(orderType)
    const currentIndex = steps.indexOf(currentStatus)

    return (
        <div className="relative space-y-0">
            {steps.map((status, i) => {
                const isDone = i < currentIndex
                const isCurrent = i === currentIndex
                const isPending = i > currentIndex

                return (
                    <div key={status} className="flex items-start gap-3 relative">
                        {/* Line */}
                        {i < steps.length - 1 && (
                            <div
                                className={`absolute right-[15px] top-8 w-0.5 h-6
                  ${isDone ? 'bg-gold' : 'bg-[var(--border-default)]'}`}
                            />
                        )}

                        {/* Circle */}
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10
                ${isDone ? 'bg-gold text-black' : ''}
                ${isCurrent ? 'bg-gold/20 border-2 border-gold' : ''}
                ${isPending ? 'bg-[var(--bg-elevated)] border border-[var(--border-default)]' : ''}
              `}
                        >
                            {isDone ? (
                                <Check size={14} className="text-black" />
                            ) : (
                                <span className="text-xs text-[var(--text-muted)]">{i + 1}</span>
                            )}
                        </div>

                        {/* Label */}
                        <div className="pt-1.5 pb-4">
                            <p
                                className={`text-sm font-medium
                  ${isDone || isCurrent ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}
                `}
                            >
                                {STATUS_LABELS[status]}
                            </p>
                            {isCurrent && (
                                <motion.p
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="text-xs text-gold mt-1"
                                >
                                    جارٍ التنفيذ...
                                </motion.p>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}