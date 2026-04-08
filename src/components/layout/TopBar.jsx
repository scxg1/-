import { Bell } from 'lucide-react'
import { getInitials } from '../../utils/formatters'
import { useAuth } from '../../hooks/useAuth'

/**
 * Top navigation bar with avatar, greeting, and notification bell.
 * @param {{ title?: string }} props
 */
export function TopBar({ title }) {
    const { profile } = useAuth()

    return (
        <div className="sticky top-0 z-40 bg-[var(--bg-base)]/80 backdrop-blur-lg border-b border-[var(--border-subtle)]">
            <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-sm">
                        {profile ? getInitials(profile.full_name) : '؟'}
                    </div>
                    <div>
                        <p className="text-xs text-[var(--text-muted)]">مرحباً</p>
                        <p className="text-sm font-bold text-[var(--text-primary)]">
                            {profile?.full_name || title || 'طلباتنا'}
                        </p>
                    </div>
                </div>
                <button className="relative p-2 rounded-xl bg-[var(--bg-elevated)]">
                    <Bell size={18} className="text-[var(--text-secondary)]" />
                </button>
            </div>
        </div>
    )
}