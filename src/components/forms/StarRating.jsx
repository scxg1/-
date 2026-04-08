import { useState } from 'react'
import { Star } from 'lucide-react'

/**
 * Interactive star rating component.
 * @param {{ value: number, onChange: function, size?: number, className?: string }} props
 */
export function StarRating({ value = 0, onChange, size = 24, className = '' }) {
    const [hovered, setHovered] = useState(0)

    return (
        <div className={`flex gap-1 ${className}`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange?.(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="transition-transform hover:scale-110"
                >
                    <Star
                        size={size}
                        className={`transition-colors
              ${(hovered || value) >= star ? 'text-gold fill-gold' : 'text-[var(--border-default)]'}
            `}
                    />
                </button>
            ))}
        </div>
    )
}