import { motion } from 'framer-motion'

/**
 * Page wrapper with animation transition.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
export function ScreenWrapper({ children, className = '' }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`min-h-screen ${className}`}
        >
            {children}
        </motion.div>
    )
}