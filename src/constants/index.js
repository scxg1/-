// ─── Pricing ────────────────────────────────
export const DELIVERY_FEE_BASE = 20
export const DELIVERY_FEE_PER_KM = 3
export const DELIVERY_FEE_MIN = 25
export const DELIVERY_FEE_MAX = 80
export const PLATFORM_COMMISSION_RATE = 0.15
export const COURIER_EARNING_RATE = 0.85

// ─── Order Types ────────────────────────────
export const ORDER_TYPES = {
    ORDER_FOR_ME: 'order_for_me',
    SEND_FOR_ME: 'send_for_me',
}

// ─── Order Statuses ─────────────────────────
export const ORDER_STATUS = {
    PENDING: 'pending',
    SEARCHING: 'searching',
    ASSIGNED: 'assigned',
    HEADING_TO_STORE: 'heading_to_store',
    AT_STORE: 'at_store',
    PURCHASED: 'purchased',
    HEADING_TO_CLIENT: 'heading_to_client',
    AT_CLIENT: 'at_client',
    PICKED_UP: 'picked_up',
    HEADING_TO_DESTINATION: 'heading_to_destination',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
}

// ─── Status Labels (Arabic) ─────────────────
export const STATUS_LABELS = {
    pending: 'في الانتظار',
    searching: 'جاري البحث عن مندوب',
    assigned: 'تم تعيين المندوب',
    heading_to_store: 'المندوب في طريقه للمحل',
    at_store: 'المندوب في المحل',
    purchased: 'تم الشراء',
    heading_to_client: 'المندوب في طريقه إليك',
    at_client: 'المندوب وصل إليك',
    picked_up: 'تم استلام الطرد',
    heading_to_destination: 'في طريقه للوجهة',
    delivered: 'تم التوصيل',
    cancelled: 'ملغي',
}

// ─── User Roles ─────────────────────────────
export const USER_ROLES = {
    CLIENT: 'client',
    COURIER: 'courier',
}

// ─── Wallet Transaction Types ───────────────
export const TRANSACTION_TYPES = {
    DEPOSIT: 'deposit',
    WITHDRAWAL: 'withdrawal',
    ORDER_PAYMENT: 'order_payment',
    COMMISSION: 'commission',
    REFUND: 'refund',
    COURIER_EARNING: 'courier_earning',
}

// ─── Quick Store Suggestions ────────────────
export const STORE_SUGGESTIONS = [
    'محل عصائر', 'صيدلية', 'مخبز', 'سوبر ماركت',
    'مطعم', 'كافيه', 'بقالة', 'محل خضار',
]

// ─── Toast Duration ─────────────────────────
export const TOAST_DURATION = 3000

// ─── Order Expiry Seconds ───────────────────
export const ORDER_EXPIRY_SECONDS = 45