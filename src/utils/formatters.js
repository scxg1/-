/**
 * Formats a number as currency in Arabic.
 * @param {number} amount
 * @returns {string} e.g. '150.00 جنيه'
 */
export function formatCurrency(amount) {
    return `${Number(amount).toFixed(2)} جنيه`
}

/**
 * Formats an ISO date string to Arabic readable format.
 * @param {string} isoString
 * @returns {string} e.g. '15 يناير 2025، 10:30 ص'
 */
export function formatDate(isoString) {
    if (!isoString) return ''
    const date = new Date(isoString)
    const months = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
    ]
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    let hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const ampm = hours >= 12 ? 'م' : 'ص'
    hours = hours % 12 || 12

    return `${day} ${month} ${year}، ${hours}:${minutes} ${ampm}`
}

/**
 * Returns relative time string in Arabic.
 * @param {string} isoString
 * @returns {string} e.g. 'منذ 5 دقائق'
 */
export function formatRelativeTime(isoString) {
    if (!isoString) return ''
    const now = new Date()
    const date = new Date(isoString)
    const diffMs = now - date
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (diffSec < 60) return 'الآن'
    if (diffMin < 60) return `منذ ${diffMin} دقائق`
    if (diffHour < 24) return `منذ ${diffHour} ساعات`
    if (diffDay === 1) return 'أمس'
    if (diffDay < 7) return `منذ ${diffDay} أيام`
    return formatDate(isoString)
}

/**
 * Formats a phone number with spaces.
 * @param {string} phone
 * @returns {string} e.g. '+20 100 000 0001'
 */
export function formatPhone(phone) {
    if (!phone) return ''
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.startsWith('0')) {
        return `+20 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`
    }
    return phone
}

/**
 * Gets initials from a full name (first letter of each word).
 * @param {string} fullName
 * @returns {string} e.g. 'م أ'
 */
export function getInitials(fullName) {
    if (!fullName) return ''
    return fullName
        .split(' ')
        .filter(Boolean)
        .map((w) => w[0])
        .slice(0, 2)
        .join(' ')
}