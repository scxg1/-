import { useState, useCallback } from 'react'
import { supabase } from '../config/supabase'
import { useToast } from './useToast'

/**
 * Handles wallet balance and transaction history.
 * @returns {{ wallet, transactions, loading, fetchWallet, fetchTransactions }}
 */
export function useWallet() {
    const [wallet, setWallet] = useState(null)
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(false)
    const { showToast } = useToast()

    const fetchWallet = useCallback(async () => {
        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from('wallets')
                .select('*')
                .eq('user_id', user.id)
                .single()

            if (error) throw error
            setWallet(data)
        } catch (err) {
            showToast('خطأ في تحميل المحفظة', 'error')
        } finally {
            setLoading(false)
        }
    }, [showToast])

    const fetchTransactions = useCallback(async () => {
        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: walletData } = await supabase
                .from('wallets')
                .select('id')
                .eq('user_id', user.id)
                .single()

            if (!walletData) return

            const { data, error } = await supabase
                .from('wallet_transactions')
                .select('*')
                .eq('wallet_id', walletData.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            setTransactions(data || [])
        } catch (err) {
            showToast('خطأ في تحميل المعاملات', 'error')
        } finally {
            setLoading(false)
        }
    }, [showToast])

    const deposit = async (amount) => {
        try {
            if (!wallet) return
            const newBalance = Number(wallet.balance) + Number(amount)

            const { error: walletError } = await supabase
                .from('wallets')
                .update({ balance: newBalance, updated_at: new Date().toISOString() })
                .eq('id', wallet.id)

            if (walletError) throw walletError

            await supabase.from('wallet_transactions').insert({
                wallet_id: wallet.id,
                type: 'deposit',
                amount: Number(amount),
                balance_after: newBalance,
                description: `إيداع ${amount} جنيه`,
            })

            setWallet((prev) => ({ ...prev, balance: newBalance }))
            showToast('تم الإيداع بنجاح', 'success')
            await fetchTransactions()
        } catch (err) {
            showToast('خطأ في عملية الإيداع', 'error')
        }
    }

    return {
        wallet,
        transactions,
        loading,
        fetchWallet,
        fetchTransactions,
        deposit,
    }
}