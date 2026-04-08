/**
 * Validates an Egyptian phone number.
 * @param {string} phone
 * @returns {{ valid: boolean, error: string }}
 */
export function validatePhone(phone) {
    if (!phone) return { valid: false, error: 'رقم الهاتف مطلوب' }
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length < 10) return { valid: false, error: 'رقم الهاتف قصير جداً' }
    if (cleaned.length > 15) return { valid: false, error: 'رقم الهاتف طويل جداً' }
    return { valid: true, error: '' }
}

/**
 * Validates password strength.
 * @param {string} password
 * @returns {{ valid: boolean, error: string }}
 */
export function validatePassword(password) {
    if (!password) return { valid: false, error: 'كلمة المرور مطلوبة' }
    if (password.length < 6) return { valid: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }
    return { valid: true, error: '' }
}

/**
 * Validates a required field.
 * @param {*} value
 * @param {string} fieldName
 * @returns {{ valid: boolean, error: string }}
 */
export function validateRequired(value, fieldName) {
    if (!value || (typeof value === 'string' && !value.trim())) {
        return { valid: false, error: `${fieldName} مطلوب` }
    }
    return { valid: true, error: '' }
}

/**
 * Validates Order Form A (اطلب لي) data.
 * @param {object} formData
 * @returns {{ valid: boolean, errors: object }}
 */
export function validateOrderFormA(formData) {
    const errors = {}

    const store = validateRequired(formData.store_name, 'اسم المحل')
    if (!store.valid) errors.store_name = store.error

    const items = validateRequired(formData.items_description, 'المنتجات المطلوبة')
    if (!items.valid) errors.items_description = items.error

    const pickup = validateRequired(formData.pickup_address, 'عنوان الاستلام')
    if (!pickup.valid) errors.pickup_address = pickup.error

    const delivery = validateRequired(formData.delivery_address, 'عنوان التوصيل')
    if (!delivery.valid) errors.delivery_address = delivery.error

    return { valid: Object.keys(errors).length === 0, errors }
}

/**
 * Validates Order Form B (وصّل عني) data.
 * @param {object} formData
 * @returns {{ valid: boolean, errors: object }}
 */
export function validateOrderFormB(formData) {
    const errors = {}

    const pkg = validateRequired(formData.package_description, 'وصف الطرد')
    if (!pkg.valid) errors.package_description = pkg.error

    const pickup = validateRequired(formData.pickup_address, 'عنوان الاستلام')
    if (!pickup.valid) errors.pickup_address = pickup.error

    const delivery = validateRequired(formData.delivery_address, 'عنوان التسليم')
    if (!delivery.valid) errors.delivery_address = delivery.error

    const recipient = validateRequired(formData.recipient_name, 'اسم المستلم')
    if (!recipient.valid) errors.recipient_name = recipient.error

    const phone = validateRequired(formData.recipient_phone, 'رقم المستلم')
    if (!phone.valid) errors.recipient_phone = phone.error

    return { valid: Object.keys(errors).length === 0, errors }
}