import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { ScreenWrapper } from '../../components/layout/ScreenWrapper'
import { TopBar } from '../../components/layout/TopBar'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { AddressField } from '../../components/forms/AddressField'
import { TimeSelector } from '../../components/forms/TimeSelector'
import { CostSummary } from '../../components/orders/CostSummary'
import { useOrders } from '../../hooks/useOrders'
import { validateOrderFormB } from '../../utils/validators'
import { calcOrderFees } from '../../utils/orderUtils'
import { ORDER_TYPES } from '../../constants'

/**
 * Order Form B — وصّل عني (send for me).
 */
export default function OrderFormB() {
    const navigate = useNavigate()
    const { createOrder, loading } = useOrders()

    const [form, setForm] = useState({
        package_description: '',
        package_value: '',
        pickup_address: '',
        delivery_address: '',
        recipient_name: '',
        recipient_phone: '',
        scheduled_time: 'asap',
        notes: '',
    })
    const [errors, setErrors] = useState({})

    const update = (field) => (e) => {
        setForm((p) => ({ ...p, [field]: e.target.value }))
        setErrors((p) => ({ ...p, [field]: '' }))
    }

    const fees = calcOrderFees(0, 5)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const validation = validateOrderFormB(form)
        if (!validation.valid) {
            setErrors(validation.errors)
            return
        }

        try {
            const order = await createOrder({
                type: ORDER_TYPES.SEND_FOR_ME,
                package_description: form.package_description,
                package_value: Number(form.package_value) || 0,
                pickup_address: form.pickup_address,
                delivery_address: form.delivery_address,
                recipient_name: form.recipient_name,
                recipient_phone: form.recipient_phone,
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
            <TopBar title="وصّل عني" />

            <div className="px-4 py-6 max-w-lg mx-auto">
                <div className="flex items-center gap-2 mb-6">
                    <button onClick={() => navigate(-1)} className="text-[var(--text-secondary)]">
                        <ArrowRight size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-[var(--text-primary)]">وصّل عني</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="وصف الطرد"
                        placeholder="مثال: مستندات مهمة في ظرف"
                        value={form.package_description}
                        onChange={update('package_description')}
                        error={errors.package_description}
                        rows={3}
                        required
                    />

                    <Input
                        label="قيمة الطرد للتأمين (اختياري)"
                        placeholder="0"
                        type="number"
                        value={form.package_value}
                        onChange={update('package_value')}
                        suffix="جنيه"
                    />

                    <AddressField
                        label="عنوان الاستلام منك"
                        value={form.pickup_address}
                        onChange={update('pickup_address')}
                        error={errors.pickup_address}
                    />

                    <AddressField
                        label="عنوان التسليم"
                        value={form.delivery_address}
                        onChange={update('delivery_address')}
                        error={errors.delivery_address}
                    />

                    <Input
                        label="اسم المستلم"
                        placeholder="اسم الشخص المستلم"
                        value={form.recipient_name}
                        onChange={update('recipient_name')}
                        error={errors.recipient_name}
                        required
                    />

                    <Input
                        label="رقم المستلم"
                        placeholder="01XXXXXXXXX"
                        type="tel"
                        value={form.recipient_phone}
                        onChange={update('recipient_phone')}
                        error={errors.recipient_phone}
                        required
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
                        totalClientPays={fees.totalClientPays}
                        type={ORDER_TYPES.SEND_FOR_ME}
                    />

                    <Button type="submit" fullWidth loading={loading}>
                        تأكيد الطلب
                    </Button>
                </form>
            </div>
        </ScreenWrapper>
    )
}