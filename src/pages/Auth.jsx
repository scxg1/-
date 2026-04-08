import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { validatePhone, validatePassword, validateRequired } from '../utils/validators'
import { USER_ROLES } from '../constants'
import { DEMO_CLIENT, DEMO_COURIER } from '../utils/sampleData'
import { ScreenWrapper } from '../components/layout/ScreenWrapper'

/**
 * Authentication page with login and register tabs.
 */
export default function Auth() {
    const navigate = useNavigate()
    const { login, register, loading } = useAuth()
    const { showToast } = useToast()
    const [tab, setTab] = useState('login')

    const [form, setForm] = useState({
        fullName: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: USER_ROLES.CLIENT,
    })
    const [errors, setErrors] = useState({})

    const updateField = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }))
        setErrors((prev) => ({ ...prev, [field]: '' }))
    }

    const handleLogin = async () => {
        const phoneErr = validatePhone(form.phone)
        const passErr = validatePassword(form.password)

        if (!phoneErr.valid || !passErr.valid) {
            setErrors({ phone: phoneErr.error, password: passErr.error })
            return
        }

        try {
            await login(form.phone, form.password)
            navigate('/home')
        } catch {
            /* handled by hook */
        }
    }

    const handleRegister = async () => {
        const errs = {}
        const nameErr = validateRequired(form.fullName, 'الاسم')
        if (!nameErr.valid) errs.fullName = nameErr.error

        const phoneErr = validatePhone(form.phone)
        if (!phoneErr.valid) errs.phone = phoneErr.error

        const passErr = validatePassword(form.password)
        if (!passErr.valid) errs.password = passErr.error

        if (form.password !== form.confirmPassword) {
            errs.confirmPassword = 'كلمتا المرور غير متطابقتين'
        }

        if (Object.keys(errs).length > 0) {
            setErrors(errs)
            return
        }

        try {
            await register(form.fullName, form.phone, form.password, form.role)
            navigate(form.role === USER_ROLES.COURIER ? '/courier' : '/home')
        } catch {
            /* handled by hook */
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (tab === 'login') handleLogin()
        else handleRegister()
    }

    return (
        <ScreenWrapper className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gold-gradient mb-2">طلباتنا</h1>
                    <p className="text-[var(--text-secondary)]">خدمة توصيل ذكية وسريعة</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-[var(--bg-elevated)] rounded-xl p-1">
                    {[
                        { key: 'login', label: 'دخول' },
                        { key: 'register', label: 'حساب جديد' },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => { setTab(key); setErrors({}) }}
                            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition
                ${tab === key ? 'bg-gold text-black' : 'text-[var(--text-secondary)]'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <AnimatePresence mode="wait">
                        {tab === 'register' && (
                            <motion.div
                                key="register-fields"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-4 overflow-hidden"
                            >
                                <Input
                                    label="الاسم الكامل"
                                    placeholder="أدخل اسمك"
                                    value={form.fullName}
                                    onChange={updateField('fullName')}
                                    error={errors.fullName}
                                    required
                                />

                                {/* Role toggle */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm text-[var(--text-secondary)]">نوع الحساب</label>
                                    <div className="flex gap-3">
                                        {[
                                            { key: USER_ROLES.CLIENT, label: 'عميل' },
                                            { key: USER_ROLES.COURIER, label: 'مندوب' },
                                        ].map(({ key, label }) => (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setForm((p) => ({ ...p, role: key }))}
                                                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition
                          ${form.role === key ? 'bg-gold text-black' : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-default)]'}`}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Input
                        label="رقم الهاتف"
                        placeholder="01XXXXXXXXX"
                        type="tel"
                        value={form.phone}
                        onChange={updateField('phone')}
                        error={errors.phone}
                        required
                    />

                    <Input
                        label="كلمة المرور"
                        placeholder="••••••"
                        type="password"
                        value={form.password}
                        onChange={updateField('password')}
                        error={errors.password}
                        required
                    />

                    <AnimatePresence>
                        {tab === 'register' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <Input
                                    label="تأكيد كلمة المرور"
                                    placeholder="••••••"
                                    type="password"
                                    value={form.confirmPassword}
                                    onChange={updateField('confirmPassword')}
                                    error={errors.confirmPassword}
                                    required
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Button type="submit" fullWidth loading={loading}>
                        {tab === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
                    </Button>
                </form>

                {/* Demo hint */}
                <div className="mt-6 p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    <p className="text-xs text-[var(--text-muted)] mb-2 font-bold">بيانات تجريبية:</p>
                    <p className="text-xs text-[var(--text-muted)]">عميل: {DEMO_CLIENT.phone} / {DEMO_CLIENT.password}</p>
                    <p className="text-xs text-[var(--text-muted)]">مندوب: {DEMO_COURIER.phone} / {DEMO_COURIER.password}</p>
                </div>
            </div>
        </ScreenWrapper>
    )
}
