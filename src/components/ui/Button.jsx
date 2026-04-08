import { motion } from 'framer-motion'
import { Spinner } from './Spinner'

const VARIANTS = {
    gold: 'bg-gold-gradient text-black font-bold shadow-lg shadow-gold/20',
    outline: 'border border-gold text-gold hover:bg-gold/10',
    ghost: 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]',
    danger: 'bg-red-600 text-white hover:bg-red-700',
}

const SIZES = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-5 py-2.5 text-base rounded-xl',
    lg: 'px-8 py-3.5 text-lg rounded-xl',
}

/**
 * Reusable button component with variants and loading state.
 * @param {{ variant?: 'gold'|'outline'|'ghost'|'danger', size?: 'sm'|'md'|'lg',
 *           loading?: boolean, disabled?: boolean, fullWidth?: boolean,
 *           onClick?: function, children: React.ReactNode, className?: string }} props
 */
export function Button({
    variant = 'gold',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    onClick,
    children,
    className = '',
    type = 'button',
}) {
    return (
        <motion.button
            whileTap={{ scale: 0.96 }}
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
        ${VARIANTS[variant]} ${SIZES[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        font-tajawal transition-all duration-200 flex items-center justify-center gap-2
        ${className}
      `}
        >
            {loading && <Spinner size="sm" />}
            {children}
        </motion.button>
    )
}