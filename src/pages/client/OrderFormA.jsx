import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { ScreenWrapper } from '../../components/layout/ScreenWrapper'
import { TopBar } from '../../components/layout/TopBar'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { QuickChips } from '../../components/forms/QuickChips'
import { AddressField } from '../../components/forms/AddressField'
import { TimeSelector } from '../../components/forms/TimeSelector'
import { CostSummary } from '../../components/orders/CostSummary'
import { useOrders } from '../../hooks/useOrders'
import { validateOrderFormA } from '../../utils/validators'
import { calcOrderFees } from '../../utils/orderUtils'
import { ORDER_TYPES } from '../../constants'

/**
 * Order Form A — اطلب لي (order for me).
 */
export default function OrderFormA() {
    const navigate = useNavigate()
    const { createOrder, loading } = useOrders()

    const [form, setForm] = useState({
        store_name: '',
        items_description: '',
        estimated_items_price: '',
        pickup_address: '',
        delivery_address: '',
        scheduled_time: 'asap',
        notes: '',
    })
    const [errors, setErrors] = useState({})

    const update = (field) => (e) => {
        setForm((p) => ({ ...p, [field]: e.target.value }))
        setErrors((p) => ({ ...p, [field]: '' }))
    }

    const fees = calcOrderFees(Number(form.estimated_items_price) || 0, 5)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const validation = validateOrderFormA(form)
        if (!validation.valid) {
            setErrors(validation.errors)
            return
        }

        try {
            const order = await createOrder({
                type: ORDER_TYPES.ORDER_FOR_ME,
                store_name: form.store_name,
                items_description: form.items_description,
                estimated_items_price: Number(form.estimated_items_price) || 0,
                pickup_address: form.pickup_address,
                delivery_address: form.delivery_address,
                scheduled_time: form.scheduled_time,
                notes: form.notes,
            })
            navigate(`/tracking/${order.id}`)
        } catch {
            /* handled by hook */
        }
    }

    return (
        <ScreenWrapper>
            <TopBar title="اطلب لي" />

            <div className="px-4 py-6 max-w-lg mx-auto">
                <div className="flex items-center gap-2 mb-6">
                    <button onClick={() => navigate(-1)} className="text-[var(--text-secondary)]">
                        <ArrowRight size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-[var(--text-primary)]">اطلب لي</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            label="اسم المحل"
                            placeholder="مثال: صيدلية الشفاء"
                            value={form.store_name}
                            onChange={update('store_name')}
                            error={errors.store_name}
                            required
                        />
                        <div className="mt-2">
                            <QuickChips onSelect={(s) => setForm((p) => ({ ...p, store_name: s }))} />
                        </div>
                    </div>

                    <Input
                        label="المنتجات المطلوبة"
                        placeholder="مثال: مسكن ألم + فيتامين سي"
                        value={form.items_description}
                        onChange={update('items_description')}
                        error={errors.items_description}
                        rows={3}
                        required
                    />

                    <Input
                        label="السعر التقريبي"
                        placeholder="0"
                        type="number"
                        value={form.estimated_items_price}
                        onChange={update('estimated_items_price')}
                        suffix="جنيه"
                    />

                    <AddressField
                        label="عنوان المحل (الاستلام)"
                        value={form.pickup_address}
                        onChange={update('pickup_address')}
                        error={errors.pickup_address}
                    />

                    <AddressField
                        label="عنوان التوصيل"
                        value={form.delivery_address}
                        onChange={update('delivery_address')}
                        error={errors.delivery_address}
                    />

                    <TimeSelector
                        value={form.scheduled_time}
                        onChange={(v) => setForm((p) => ({ ...p, scheduled_time: v }))}
                    />

                    <Input
                        label="ملاحظات"
                        placeholder="أي ملاحظات إضافية (اختياري)"
                        value={form.notes}
                        onChange={update('notes')}
                        rows={2}
                    />

                    <CostSummary
                        deliveryFee={fees.deliveryFee}
                        itemsPrice={Number(form.estimated_items_price) || 0}
                        totalClientPays={fees.totalClientPays}
                        type={ORDER_TYPES.ORDER_FOR_ME}
                    />

                    <Button type="submit" fullWidth loading={loading}>
                        تأكيد الطلب
                    </Button>
                </form>
            </div>
        </ScreenWrapper>
    )
}