import { motion } from 'framer-motion'

/**
 * Animated loading spinner component.
 * @param {{ size?: 'sm'|'md'|'lg', className?: string }} props
 */
export function Spinner({ size = 'md', className = '' }) {
    const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }

    return (
        <motion.div
            className={`${sizes[size]} border-2 border-[var(--border-default)] border-t-gold rounded-full ${className}`}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
        />
    )
}