import { Phone, MessageSquare, Star } from 'lucide-react'
import { useToast } from '../../hooks/useToast'

/**
 * Displays assigned courier info with contact actions.
 * @param {{ courierName?: string, rating?: number }} props
 */
export function CourierInfo({ courierName = 'المندوب', rating = 4.8 }) {
    const { showToast } = useToast()

    const handleCall = () => showToast('سيتم إضافة الاتصال قريباً', 'info')
    const handleMessage = () => showToast('سيتم إضافة المحادثة قريباً', 'info')

    return (
        <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gold/20 flex items-center justify-center">
                        <span className="text-gold font-bold text-sm">مندوب</span>
                    </div>
                    <div>
                        <p className="font-bold text-[var(--text-primary)] text-sm">{courierName}</p>
                        <div className="flex items-center gap-1 text-xs text-gold">
                            <Star size={12} fill="currentColor" />
                            <span>{rating}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleCall}
                        className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 hover:bg-green-500/20 transition"
                    >
                        <Phone size={16} />
                    </button>
                    <button
                        onClick={handleMessage}
                        className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center text-gold hover:bg-gold/20 transition"
                    >
                        <MessageSquare size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}