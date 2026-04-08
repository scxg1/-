import { motion } from 'framer-motion'

/**
 * Simulated map with animated scooter icon.
 */
export function SimulatedMap() {
    return (
        <div className="relative w-full h-48 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] overflow-hidden">
            {/* Grid lines */}
            <div className="absolute inset-0 opacity-10">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={`h-${i}`}
                        className="absolute w-full h-px bg-[var(--text-secondary)]"
                        style={{ top: `${(i + 1) * 12.5}%` }}
                    />
                ))}
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={`v-${i}`}
                        className="absolute h-full w-px bg-[var(--text-secondary)]"
                        style={{ left: `${(i + 1) * 12.5}%` }}
                    />
                ))}
            </div>

            {/* Route line */}
            <svg className="absolute inset-0 w-full h-full">
                <path
                    d="M 40 140 Q 100 60 180 100 T 300 50"
                    stroke="#C9A84C"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    fill="none"
                    opacity="0.5"
                />
            </svg>

            {/* Start marker */}
            <div className="absolute bottom-8 right-8 w-4 h-4 rounded-full bg-green-500 animate-pulse" />

            {/* End marker */}
            <div className="absolute top-6 left-8 w-4 h-4 rounded-full bg-gold" />

            {/* Animated scooter */}
            <motion.div
                animate={{ x: [0, 60, 120, 180], y: [0, -30, -10, -50] }}
                transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                className="absolute bottom-8 right-8 text-gold text-xl"
            >
                🏍️
            </motion.div>

            <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-[var(--text-muted)]">
                المحاكاة — الخريطة الحقيقية قريباً
            </div>
        </div>
    )
}