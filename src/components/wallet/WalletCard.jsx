import { formatCurrency } from '../../utils/formatters'
import { Plus, ArrowUpRight } from 'lucide-react'

/**
 * Gold gradient wallet card showing balance and action buttons.
 * @param {{ balance: number, onDeposit: function, onWithdraw: function }} props
 */
export function WalletCard({ balance = 0, onDeposit, onWithdraw }) {
    return (
        <div className="bg-gold-gradient rounded-2xl p-6 text-black relative overflow-hidden">
            <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-white/10" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/5" />

            <div className="relative z-10">
                <p className="text-sm opacity-80 mb-1">رصيدك الحالي</p>
                <p className="text-3xl font-extrabold mb-6">{formatCurrency(balance)}</p>

                <div className="flex gap-3">
                    <button
                        onClick={onDeposit}
                        className="flex items-center gap-2 bg-black/20 hover:bg-black/30 rounded-xl px-5 py-2.5 text-sm font-bold transition"
                    >
                        <Plus size={16} />
                        إيداع
                    </button>
                    <button
                        onClick={onWithdraw}
                        className="flex items-center gap-2 bg-black/20 hover:bg-black/30 rounded-xl px-5 py-2.5 text-sm font-bold transition"
                    >
                        <ArrowUpRight size={16} />
                        سحب
                    </button>
                </div>
            </div>
        </div>
    )
}