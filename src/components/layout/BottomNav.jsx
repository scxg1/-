import { Home, ClipboardList, Wallet, Settings } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
    { path: '/home', icon: Home, label: 'الرئيسية' },
    { path: '/orders', icon: ClipboardList, label: 'طلباتي' },
    { path: '/wallet', icon: Wallet, label: 'محفظتي' },
    { path: '/settings', icon: Settings, label: 'الإعدادات' },
]

/**
 * Bottom navigation bar for client pages.
 */
export function BottomNav() {
    const location = useLocation()
    const navigate = useNavigate()

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-surface)]/90 backdrop-blur-lg border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-around max-w-lg mx-auto py-2">
                {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
                    const isActive = location.pathname === path
                    return (
                        <button
                            key={path}
                            onClick={() => navigate(path)}
                            className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-colors
                ${isActive ? 'text-gold' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                        >
                            <Icon size={20} />
                            <span className="text-[10px]">{label}</span>
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}