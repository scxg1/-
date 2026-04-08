import { TransactionItem } from './TransactionItem'
import { EmptyState } from '../ui/EmptyState'

/**
 * List of transaction items.
 * @param {{ transactions: array }} props
 */
export function TransactionList({ transactions }) {
    if (!transactions || transactions.length === 0) {
        return (
            <EmptyState
                title="لا توجد معاملات"
                description="ستظهر هنا معاملاتك المالية"
            />
        )
    }

    return (
        <div className="space-y-0">
            {transactions.map((tx) => (
                <TransactionItem key={tx.id} transaction={tx} />
            ))}
        </div>
    )
}