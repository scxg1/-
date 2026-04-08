import { create } from 'zustand'
import { TOAST_DURATION } from '../constants'

/**
 * Global Zustand store for toast notifications and theme.
 */
const useStore = create((set) => ({
    // Toast state
    toast: null,
    showToast: (message, type = 'info') => {
        const id = Date.now()
        set({ toast: { id, message, type } })
        setTimeout(() => {
            set((state) => {
                if (state.toast && state.toast.id === id) return { toast: null }
                return state
            })
        }, TOAST_DURATION)
    },
    hideToast: () => set({ toast: null }),

    // Theme state
    isDarkMode: true,
    toggleTheme: () =>
        set((state) => {
            const next = !state.isDarkMode
            document.body.classList.toggle('light-mode', !next)
            return { isDarkMode: next }
        }),
}))

export default useStore