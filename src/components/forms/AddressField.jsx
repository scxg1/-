import { MapPin } from 'lucide-react'
import { Input } from '../ui/Input'

/**
 * Address input field with map pin icon prefix.
 * @param {{ label?: string, placeholder?: string, value?: string, onChange?: function, error?: string }} props
 */
export function AddressField({ label, placeholder, value, onChange, error }) {
    return (
        <Input
            label={label}
            placeholder={placeholder || 'أدخل العنوان'}
            value={value}
            onChange={onChange}
            error={error}
            prefix="📍"
        />
    )
}