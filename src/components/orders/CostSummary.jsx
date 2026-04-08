import { formatCurrency } from '../../utils/formatters'

/**
 * Order cost breakdown summary card.
 * @param {{ deliveryFee: number, itemsPrice?: number, totalClientPays: number, type: string }} props
 */
export function CostSummary({ deliveryFee, itemsPrice = 0, totalClientPays, type }) {
    return (
        <div className="glass rounded-2xl p-4 space-y-3">
            <h4 className="font-bold text-[var(--text-primary)] text-sm mb-3">ملخص التكلفة</h4>

            <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">رسوم التوصيل</span>
                <span className="text-[var(--text-primary)]">{formatCurrency(deliveryFee)}</span>
            </div>

            {type === 'order_for_me' && itemsPrice > 0 && (
                <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">السعر التقريبي للمنتجات</span>
                    <span className="text-[var(--text-primary)]">{formatCurrency(itemsPrice)}</span>
                </div>
            )}

            <div className="border-t border-[var(--border-subtle)] pt-3 flex justify-between">
                <span className="font-bold text-[var(--text-primary)]">الإجمالي</span>
                <span className="font-bold text-gold text-lg">{formatCurrency(totalClientPays)}</span>
            </div>
        </div>
    )
}