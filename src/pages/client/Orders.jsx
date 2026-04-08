import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { ScreenWrapper } from '../../components/layout/ScreenWrapper'
import { TopBar } from '../../components/layout/TopBar'
import { BottomNav } from '../../components/layout/BottomNav'
import { OrderCard } from '../../components/orders/OrderCard'
import { Input } from '../../components/ui/Input'
import { EmptyState } from '../../components/ui/EmptyState'
import { useOrders } from '../../hooks/useOrders'
import { useToast } from '../../hooks/useToast'
import { isOrderActive } from '../../utils/orderUtils'

const FILTERS = [
    { key: 'all', label: 'الكل' },
    { key: 'active', label: 'الجارية' },
    { key: 'completed', label: 'المكتملة' },
    { key: 'cancelled', label: 'الملغاة' },
]

/**
 * Orders list page with filtering and search.
 */
export default function Orders() {
    const navigate = useNavigate()
    const { orders, fetchMyOrders } = useOrders()
    const { showToast } = useToast()
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchMyOrders()
    }, [fetchMyOrders])

    const filtered = useMemo(() => {
        let result = orders

        if (filter === 'active') result = orders.filter((o) => isOrderActive(o.status))
        if (filter === 'completed') result = orders.filter((o) => o.status === 'delivered')
        if (filter === 'cancelled') result = orders.filter((o) => o.status === 'cancelled')

        if (search.trim()) {
            const q = search.toLowerCase()
            result = result.filter(
                (o) =>
                    o.order_number?.toLowerCase().includes(q) ||
                    o.store_name?.toLowerCase().includes(q) ||
                    o.package_description?.toLowerCase().includes(q)
            )
        }

        return result
    }, [orders, filter, search])

    const handleRate = (orderId) => {
        showToast('سيتم إضافة التقييم قريباً', 'info')
    }

    return (
        <ScreenWrapper>
            <TopBar title="طلباتي" />

            <div className="px-4 py-4 max-w-lg mx-auto">
                {/* Filters */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
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

                {/* Search */}
                <div className="mb-4">
                    <Input
                        placeholder="ابحث برقم الطلب أو المحل..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        prefix="🔍"
                    />
                </div>

                {/* List */}
                {filtered.length > 0 ? (
                    <div className="space-y-3">
                        {filtered.map((order) => (
                            <OrderCard key={order.id} order={order} onRate={handleRate} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="لا توجد طلبات"
                        description={
                            filter === 'all'
                                ? 'لم تقم بأي طلب بعد'
                                : `لا توجد طلبات ${FILTERS.find((f) => f.key === filter)?.label || ''}`
                        }
                    />
                )}
            </div>

            <BottomNav />
        </ScreenWrapper>
    )
}