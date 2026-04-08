import {
    DELIVERY_FEE_BASE,
    DELIVERY_FEE_PER_KM,
    DELIVERY_FEE_MIN,
    DELIVERY_FEE_MAX,
    PLATFORM_COMMISSION_RATE,
    COURIER_EARNING_RATE,
    ORDER_STATUS,
    ORDER_TYPES,
} from '../constants'

/**
 * Generates a unique order number.
 * @returns {string} Format: 'ORD-XXXXXX'
 */
export function generateOrderNumber() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = 'ORD-'
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

/**
 * Calculates delivery fee based on distance.
 * @param {number} distanceKm - Distance in kilometers
 * @returns {number} Delivery fee in EGP
 */
export function calcDeliveryFee(distanceKm = 5) {
    const fee = DELIVERY_FEE_BASE + distanceKm * DELIVERY_FEE_PER_KM
    return Math.min(Math.max(fee, DELIVERY_FEE_MIN), DELIVERY_FEE_MAX)
}

/**
 * Calculates full order fee breakdown.
 * @param {number} estimatedItemsPrice
 * @param {number} distanceKm
 * @returns {{ deliveryFee, platformCommission, courierEarning, totalClientPays }}
 */
export function calcOrderFees(estimatedItemsPrice = 0, distanceKm = 5) {
    const deliveryFee = calcDeliveryFee(distanceKm)
    const totalClientPays = deliveryFee + estimatedItemsPrice
    const platformCommission = deliveryFee * PLATFORM_COMMISSION_RATE
    const courierEarning = deliveryFee * COURIER_EARNING_RATE

    return {
        deliveryFee,
        platformCommission: Math.round(platformCommission * 100) / 100,
        courierEarning: Math.round(courierEarning * 100) / 100,
        totalClientPays,
    }
}

/**
 * Returns ordered status steps for timeline based on order type.
 * @param {'order_for_me'|'send_for_me'} orderType
 * @returns {string[]}
 */
export function getStatusSteps(orderType) {
    if (orderType === ORDER_TYPES.ORDER_FOR_ME) {
        return [
            ORDER_STATUS.PENDING,
            ORDER_STATUS.SEARCHING,
            ORDER_STATUS.ASSIGNED,
            ORDER_STATUS.HEADING_TO_STORE,
            ORDER_STATUS.AT_STORE,
            ORDER_STATUS.PURCHASED,
            ORDER_STATUS.HEADING_TO_CLIENT,
            ORDER_STATUS.AT_CLIENT,
            ORDER_STATUS.DELIVERED,
        ]
    }
    return [
        ORDER_STATUS.PENDING,
        ORDER_STATUS.SEARCHING,
        ORDER_STATUS.ASSIGNED,
        ORDER_STATUS.HEADING_TO_CLIENT,
        ORDER_STATUS.AT_CLIENT,
        ORDER_STATUS.PICKED_UP,
        ORDER_STATUS.HEADING_TO_DESTINATION,
        ORDER_STATUS.DELIVERED,
    ]
}

/**
 * Checks if an order is currently active (in progress).
 * @param {string} status
 * @returns {boolean}
 */
export function isOrderActive(status) {
    const activeStatuses = [
        'pending', 'searching', 'assigned', 'heading_to_store',
        'at_store', 'purchased', 'heading_to_client', 'at_client',
        'picked_up', 'heading_to_destination',
    ]
    return activeStatuses.includes(status)
}

/**
 * Checks if an order is completed or cancelled.
 * @param {string} status
 * @returns {boolean}
 */
export function isOrderCompleted(status) {
    return status === 'delivered' || status === 'cancelled'
}