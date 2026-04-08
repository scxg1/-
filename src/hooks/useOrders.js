import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../config/supabase'
import { useToast } from './useToast'
import { generateOrderNumber, calcOrderFees, isOrderActive } from '../utils/orderUtils'
import { ORDER_TYPES, ORDER_STATUS } from '../constants'

/**
 * Handles order creation, fetching, and real-time updates.
 * @returns {{ orders, activeOrder, loading, createOrder, cancelOrder, fetchMyOrders, subscribeToOrder, submitRating }}
 */
export function useOrders() {
    const [orders, setOrders] = useState([])
    const [activeOrder, setActiveOrder] = useState(null)
    const [loading, setLoading] = useState(false)
    const { showToast } = useToast()

    const fetchMyOrders = useCallback(async () => {
        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('client_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            setOrders(data || [])

            const active = (data || []).find((o) => isOrderActive(o.status))
            setActiveOrder(active || null)
        } catch (err) {
            showToast('خطأ في تحميل الطلبات', 'error')
        } finally {
            setLoading(false)
        }
    }, [showToast])

    const createOrder = async (orderData) => {
        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('يجب تسجيل الدخول أولاً')

            const distanceKm = orderData.distanceKm || 5
            const fees = calcOrderFees(orderData.estimated_items_price || 0, distanceKm)

            const newOrder = {
                order_number: generateOrderNumber(),
                client_id: user.id,
                type: orderData.type,
                status: ORDER_STATUS.SEARCHING,
                store_name: orderData.store_name || null,
                items_description: orderData.items_description || null,
                estimated_items_price: orderData.estimated_items_price || null,
                package_description: orderData.package_description || null,
                package_value: orderData.package_value || null,
                recipient_name: orderData.recipient_name || null,
                recipient_phone: orderData.recipient_phone || null,
                pickup_address: orderData.pickup_address,
                delivery_address: orderData.delivery_address,
                scheduled_time: orderData.scheduled_time || 'asap',
                notes: orderData.notes || null,
                delivery_fee: fees.deliveryFee,
                platform_commission: fees.platformCommission,
                courier_earning: fees.courierEarning,
                total_client_pays: fees.totalClientPays,
            }

            const { data, error } = await supabase
                .from('orders')
                .insert(newOrder)
                .select()
                .single()

            if (error) throw error

            await supabase.from('order_status_history').insert({
                order_id: data.id,
                status: ORDER_STATUS.SEARCHING,
                changed_by: user.id,
            })

            setActiveOrder(data)
            showToast('تم إنشاء الطلب بنجاح', 'success')
            return data
        } catch (err) {
            showToast(err.message || 'خطأ في إنشاء الطلب', 'error')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const cancelOrder = async (orderId) => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { error } = await supabase
                .from('orders')
                .update({
                    status: ORDER_STATUS.CANCELLED,
                    cancelled_by: 'client',
                    cancel_reason: 'إلغاء من العميل',
                })
                .eq('id', orderId)
                .eq('client_id', user.id)

            if (error) throw error

            await supabase.from('order_status_history').insert({
                order_id: orderId,
                status: ORDER_STATUS.CANCELLED,
                note: 'إلغاء من العميل',
                changed_by: user.id,
            })

            setActiveOrder(null)
            setOrders((prev) =>
                prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' } : o))
            )
            showToast('تم إلغاء الطلب', 'info')
        } catch (err) {
            showToast('خطأ في إلغاء الطلب', 'error')
        }
    }

    const subscribeToOrder = useCallback((orderId, onUpdate) => {
        const channel = supabase
            .channel(`order-${orderId}`)
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
                (payload) => {
                    const updated = payload.new
                    setActiveOrder((prev) => (prev?.id === orderId ? { ...prev, ...updated } : prev))
                    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, ...updated } : o)))
                    if (onUpdate) onUpdate(updated)
                }
            )
            .subscribe()

        return () => supabase.removeChannel(channel)
    }, [])

    const submitRating = async (orderId, rating, comment = '') => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ rating, rating_comment: comment })
                .eq('id', orderId)

            if (error) throw error
            showToast('شكراً لتقييمك!', 'success')
        } catch (err) {
            showToast('خطأ في إرسال التقييم', 'error')
        }
    }

    return {
        orders,
        activeOrder,
        loading,
        createOrder,
        cancelOrder,
        fetchMyOrders,
        subscribeToOrder,
        submitRating,
    }
}