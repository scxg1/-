import useStore from '../store/useStore'

/**
 * Global toast notification helper.
 * @returns {{ showToast: function, hideToast: function, toast: object|null }}
 */
export function useToast() {
    const toast = useStore((s) => s.toast)
    const showToast = useStore((s) => s.showToast)
    const hideToast = useStore((s) => s.hideToast)

    return { toast, showToast, hideToast }
}