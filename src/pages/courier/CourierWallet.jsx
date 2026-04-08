import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { ScreenWrapper } from '../../components/layout/ScreenWrapper'
import { WalletCard } from '../../components/wallet/WalletCard'
import { TransactionList } from '../../components/wallet/TransactionList'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { useWallet } from '../../hooks/useWallet'
import { formatCurrency } from '../../utils/formatters'

/**
 * Courier wallet page — earnings and transactions.
 */
export default function CourierWallet() {
    const navigate = useNavigate()
    const { wallet, transactions, fetchWallet, fetchTransactions, deposit } = useWallet()
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

    const earnings = transactions.filter((t) => t.type === 'courier_earning')

    return (
        <ScreenWrapper>
            <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
                <div className="flex items-center gap-2 mb-2">
                    <button onClick={() => navigate('/courier')} className="text-[var(--text-secondary)]">
                        <ArrowRight size={20} />
                    </button>
                    <h1 className="text-lg font-bold">محفظتي</h1>
                </div>

                <WalletCard
                    balance={wallet?.balance || 0}
                    onDeposit={() => setModalOpen(true)}
                    onWithdraw={() => setModalOpen(true)}
                />

                {/* Monthly summary */}
                <div className="glass rounded-2xl p-4">
                    <h3 className="font-bold text-sm text-[var(--text-primary)] mb-2">إجمالي الأرباح</h3>
                    <p className="text-2xl font-extrabold text-gold">{formatCurrency(wallet?.balance || 0)}</p>
                </div>

                <div>
                    <h3 className="font-bold text-sm text-[var(--text-muted)] mb-3">أرباح التوصيلات</h3>
                    <TransactionList transactions={earnings} />
                </div>
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
                    <Button fullWidth onClick={handleDeposit}>تأكيد</Button>
                </div>
            </Modal>
        </ScreenWrapper>
    )
}