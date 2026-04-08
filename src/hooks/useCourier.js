import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../config/supabase'
import { useToast } from './useToast'
import { ORDER_STATUS } from '../constants'

/**
 * Handles courier-specific operations.
 * @returns {{ stats, pendingOrders, activeOrder, loading,
 *             toggleOnline, acceptOrder, updateOrderStatus, fetchPendingOrders, fetchMyStats }}
 */
export function useCourier() {
    const [stats, setStats] = useState(null)
    const [pendingOrders, setPendingOrders] = useState([])
    const [activeOrder, setActiveOrder] = useState(null)
    const [loading, setLoading] = useState(false)
    const { showToast } = useToast()

    const fetchMyStats = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from('courier_stats')
                .select('*')
                .eq('courier_id', user.id)
                .single()

            if (error) throw error
            setStats(data)
        } catch (err) {
            showToast('خطأ في تحميل الإحصائيات', 'error')
        }
    }, [showToast])

    const fetchPendingOrders = useCallback(async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('status', ORDER_STATUS.SEARCHING)
                .is('courier_id', null)
                .order('created_at', { ascending: false })

            if (error) throw error
            setPendingOrders(data || [])
        } catch (err) {
            showToast('خطأ في تحميل الطلبات المتاحة', 'error')
        } finally {
            setLoading(false)
        }
    }, [showToast])

    const fetchActiveOrder = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const activeStatuses = [
                ORDER_STATUS.ASSIGNED,
                ORDER_STATUS.HEADING_TO_STORE,
                ORDER_STATUS.AT_STORE,
                ORDER_STATUS.PURCHASED,
                ORDER_STATUS.HEADING_TO_CLIENT,
                ORDER_STATUS.AT_CLIENT,
                ORDER_STATUS.PICKED_UP,
                ORDER_STATUS.HEADING_TO_DESTINATION,
            ]

            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('courier_id', user.id)
                .in('status', activeStatuses)
                .order('assigned_at', { ascending: false })
                .limit(1)
                .maybeSingle()

            if (error) throw error
            setActiveOrder(data)
        } catch (err) {
            showToast('خطأ في تحميل الطلب النشط', 'error')
        }
    }, [showToast])

    const toggleOnline = async (isOnline) => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { error } = await supabase
                .from('courier_stats')
                .update({ is_online: isOnline, updated_at: new Date().toISOString() })
                .eq('courier_id', user.id)

            if (error) throw error
            setStats((prev) => (prev ? { ...prev, is_online: isOnline } : prev))
            showToast(isOnline ? 'أنت الآن متاح' : 'أنت غير متاح', 'info')

            if (isOnline) {
                fetchPendingOrders()
            } else {
                setPendingOrders([])
            }
        } catch (err) {
            showToast('خطأ في تحديث الحالة', 'error')
        }
    }

    const acceptOrder = async (orderId) => {
        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('يجب تسجيل الدخول')

            const { data: order, error: fetchErr } = await supabase
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single()

            if (fetchErr) throw fetchErr
            if (order.courier_id) {
                showToast('تم قبول هذا الطلب بواسطة مندوب آخر', 'warning')
                return
            }

            const { error } = await supabase
                .from('orders')
                .update({
                    courier_id: user.id,
                    status: ORDER_STATUS.ASSIGNED,
                    assigned_at: new Date().toISOString(),
                })
                .eq('id', orderId)

            if (error) throw error

            await supabase.from('order_status_history').insert({
                order_id: orderId,
                status: ORDER_STATUS.ASSIGNED,
                changed_by: user.id,
            })

            await supabase.from('courier_stats').update({
                total_orders: (stats?.total_orders || 0) + 1,
            }).eq('courier_id', user.id)

            setActiveOrder({ ...order, courier_id: user.id, status: ORDER_STATUS.ASSIGNED })
            setPendingOrders((prev) => prev.filter((o) => o.id !== orderId))
            showToast('تم قبول الطلب!', 'success')
        } catch (err) {
            showToast(err.message || 'خطأ في قبول الطلب', 'error')
        } finally {
            setLoading(false)
        }
    }

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const updates = { status: newStatus }
            if (newStatus === ORDER_STATUS.DELIVERED) {
                updates.delivered_at = new Date().toISOString()
            }

            const { error } = await supabase
                .from('orders')
                .update(updates)
                .eq('id', orderId)

            if (error) throw error

            await supabase.from('order_status_history').insert({
                order_id: orderId,
                status: newStatus,
                changed_by: user.id,
            })

            if (newStatus === ORDER_STATUS.DELIVERED) {
                const order = activeOrder
                if (order) {
                    await supabase.from('courier_stats').update({
                        completed_orders: (stats?.completed_orders || 0) + 1,
                        total_earned: Number(stats?.total_earned || 0) + Number(order.courier_earning),
                    }).eq('courier_id', user.id)
                }
                setActiveOrder(null)
                await fetchMyStats()
            } else {
                setActiveOrder((prev) => (prev ? { ...prev, status: newStatus } : null))
            }

            showToast('تم تحديث الحالة', 'success')
        } catch (err) {
            showToast('خطأ في تحديث الحالة', 'error')
        }
    }

    useEffect(() => {
        let channel
        const subscribeToNewOrders = () => {
            channel = supabase
                .channel('pending-orders')
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'orders' },
                    (payload) => {
                        if (payload.new.status === ORDER_STATUS.SEARCHING && !payload.new.courier_id) {
                            setPendingOrders((prev) => [payload.new, ...prev])
                        }
                    }
                )
                .subscribe()
        }

        if (stats?.is_online) subscribeToNewOrders()
        return () => { if (channel) supabase.removeChannel(channel) }
    }, [stats?.is_online])

    return {
        stats,
        pendingOrders,
        activeOrder,
        loading,
        toggleOnline,
        acceptOrder,
        updateOrderStatus,
        fetchPendingOrders,
        fetchMyStats,
        fetchActiveOrder,
    }
}