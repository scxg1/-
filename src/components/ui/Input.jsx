import { motion, AnimatePresence } from 'framer-motion'

/**
 * Form input component with label, error handling, and animations.
 * @param {{ label?: string, placeholder?: string, error?: string, prefix?: string,
 *           suffix?: string, type?: string, value?: string, onChange?: function,
 *           required?: boolean, className?: string, rows?: number }} props
 */
export function Input({
    label,
    placeholder,
    error,
    prefix,
    suffix,
    type = 'text',
    value,
    onChange,
    required = false,
    className = '',
    rows,
    ...rest
}) {
    const isTextarea = rows && rows > 1

    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label className="text-sm text-[var(--text-secondary)]">
                    {label}
                    {required && <span className="text-red-400 mr-1">*</span>}
                </label>
            )}
            <div className="relative">
                {prefix && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">
                        {prefix}
                    </span>
                )}
                {isTextarea ? (
                    <textarea
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        rows={rows}
                        className={`
              w-full bg-[var(--bg-elevated)] border rounded-xl px-4 py-3
              ${prefix ? 'pr-10' : ''} ${suffix ? 'pl-10' : ''}
              text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
              focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30
              transition-all duration-200 resize-none font-tajawal
              ${error ? 'border-red-500' : 'border-[var(--border-default)]'}
            `}
                        {...rest}
                    />
                ) : (
                    <input
                        type={type}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        className={`
              w-full bg-[var(--bg-elevated)] border rounded-xl px-4 py-3
              ${prefix ? 'pr-10' : ''} ${suffix ? 'pl-10' : ''}
              text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
              focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30
              transition-all duration-200 font-tajawal
              ${error ? 'border-red-500' : 'border-[var(--border-default)]'}
            `}
                        {...rest}
                    />
                )}
                {suffix && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">
                        {suffix}
                    </span>
                )}
            </div>
            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-red-400 text-xs"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    )
}