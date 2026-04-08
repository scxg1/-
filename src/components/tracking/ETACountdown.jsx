import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

/**
 * Countdown timer showing estimated arrival time.
 * @param {{ minutes?: number, className?: string }} props
 */
export function ETACountdown({ minutes = 25, className = '' }) {
    const [seconds, setSeconds] = useState(minutes * 60)

    useEffect(() => {
        if (seconds <= 0) return
        const timer = setInterval(() => setSeconds((s) => s - 1), 1000)
        return () => clearInterval(timer)
    }, [seconds])

    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60

    return (
        <div className={`flex items-center gap-2 text-sm ${className}`}>
            <Clock size={16} className="text-gold" />
            <span className="text-[var(--text-secondary)]">الوقت المتوقع:</span>
            <span className="font-bold text-gold font-mono">
                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </span>
        </div>
    )
}