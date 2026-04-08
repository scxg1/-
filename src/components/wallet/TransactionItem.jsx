import { ArrowDownLeft, ArrowUpRight, RotateCcw, ShoppingBag, DollarSign } from 'lucide-react'
import { formatCurrency, formatRelativeTime } from '../../utils/formatters'

const TYPE_CONFIG = {
    deposit: { icon: ArrowDownLeft, color: 'text-green-400', bg: 'bg-green-500/10', amountColor: 'text-green-400' },
    withdrawal: { icon: ArrowUpRight, color: 'text-red-400', bg: 'bg-red-500/10', amountColor: 'text-red-400' },
    order_payment: { icon: ShoppingBag, color: 'text-red-400', bg: 'bg-red-500/10', amountColor: 'text-red-400' },
    commission: { icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-500/10', amountColor: 'text-amber-400' },
    refund: { icon: RotateCcw, color: 'text-gold', bg: 'bg-gold/10', amountColor: 'text-gold' },
    courier_earning: { icon: ArrowDownLeft, color: 'text-green-400', bg: 'bg-green-500/10', amountColor: 'text-green-400' },
}

/**
 * Single transaction list item.
 * @param {{ transaction: object }} props
 */
export function TransactionItem({ transaction }) {
    const config = TYPE_CONFIG[transaction.type] || TYPE_CONFIG.deposit
    const Icon = config.icon
    const isPositive = ['deposit', 'refund', 'courier_earning'].includes(transaction.type)

    return (
        <div className="flex items-center gap-3 py-3 border-b border-[var(--border-subtle)] last:border-0">
            <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center`}>
                <Icon size={18} className={config.color} />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--text-primary)] truncate">{transaction.description}</p>
                <p className="text-xs text-[var(--text-muted)]">{formatRelativeTime(transaction.created_at)}</p>
            </div>

            <div className="text-left">
                <p className={`text-sm font-bold ${config.amountColor}`}>
                    {isPositive ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
                <p className="text-[10px] text-[var(--text-muted)]">
                    رصيد: {formatCurrency(transaction.balance_after)}
                </p>
            </div>
        </div>
    )
}