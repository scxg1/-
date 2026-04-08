import { motion } from 'framer-motion'

/**
 * Glass-style card component with optional hover effect.
 * @param {{ children: React.ReactNode, className?: string, hover?: boolean, onClick?: function }} props
 */
export function Card({ children, className = '', hover = false, onClick }) {
    return (
        <motion.div
            whileHover={hover ? { y: -3, boxShadow: '0 8px 30px rgba(201,168,76,0.15)' } : {}}
            onClick={onClick}
            className={`
        glass rounded-2xl p-4
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
        >
            {children}
        </motion.div>
    )
}