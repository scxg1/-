import { useEffect, useState } from 'react'
import { ScreenWrapper } from '../../components/layout/ScreenWrapper'
import { TopBar } from '../../components/layout/TopBar'
import { BottomNav } from '../../components/layout/BottomNav'
import { WalletCard } from '../../components/wallet/WalletCard'
import { TransactionList } from '../../components/wallet/TransactionList'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { useWallet } from '../../hooks/useWallet'

const FILTERS = [
    { key: 'all', label: 'الكل' },
    { key: 'deposits', label: 'دفعات' },
    { key: 'payments', label: 'مدفوعات' },
    { key: 'refunds', label: 'استرداد' },
]

/**
 * Client wallet page with balance and transactions.
 */
export default function Wallet() {
    const { wallet, transactions, fetchWallet, fetchTransactions, deposit } = useWallet()
    const [filter, setFilter] = useState('all')
    const [modalOpen, setModalOpen] = useState(false)
    const [amount, setAmount] = useState('')

    useEffect(() => {
        fetchWallet()
        fetchTransactions()
    }, [fetchWallet, fetchTransactions])

    const handleDeposit = async () => {
        const num = Number(amount)
        if (num > 0) {
            await deposit(num)
            setAmount('')
            setModalOpen(false)
        }
    }

    const filtered = filter === 'all'
        ? transactions
        : filter === 'deposits'
            ? transactions.filter((t) => t.type === 'deposit' || t.type === 'courier_earning')
            : filter === 'payments'
                ? transactions.filter((t) => t.type === 'order_payment')
                : transactions.filter((t) => t.type === 'refund')

    return (
        <ScreenWrapper>
            <TopBar title="محفظتي" />

            <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
                <WalletCard
                    balance={wallet?.balance || 0}
                    onDeposit={() => setModalOpen(true)}
                    onWithdraw={() => setModalOpen(true)}
                />

                <div className="flex gap-2 overflow-x-auto pb-2">
                    {FILTERS.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition
                ${filter === key ? 'bg-gold text-black' : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)]'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <TransactionList transactions={filtered} />
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="إيداع رصيد">
                <div className="space-y-4">
                    <Input
                        label="المبلغ"
                        type="number"
                        placeholder="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        suffix="جنيه"
                    />
                    <Button fullWidth onClick={handleDeposit}>
                        تأكيد الإيداع
                    </Button>
                </div>
            </Modal>

            <BottomNav />
        </ScreenWrapper>
    )
}