import { useState } from 'react'
import { Clock } from 'lucide-react'

/**
 * Time selector: ASAP or scheduled time.
 * @param {{ value: string, onChange: function }} props
 */
export function TimeSelector({ value, onChange }) {
    const options = [
        { key: 'asap', label: 'أسرع وقت', icon: '⚡' },
        { key: 'scheduled', label: 'وقت محدد', icon: '🕐' },
    ]

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[var(--text-secondary)]">
                <Clock size={14} className="inline ml-1" />
                وقت الاستلام
            </label>
            <div className="flex gap-3">
                {options.map((opt) => (
                    <button
                        key={opt.key}
                        type="button"
                        onClick={() => onChange(opt.key)}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all
              ${value === opt.key
                                ? 'bg-gold text-black'
                                : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-default)]'
                            }`}
                    >
                        {opt.icon} {opt.label}
                    </button>
                ))}
            </div>
        </div>
    )
}