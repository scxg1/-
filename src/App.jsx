import { RouterProvider } from './router'
import { Toast } from './components/ui/Toast'

/**
 * Root application component.
 * Renders the router and global toast overlay.
 */
export default function App() {
    return (
        <div className="min-h-screen font-tajawal">
            <RouterProvider />
            <Toast />
        </div>
    )
}