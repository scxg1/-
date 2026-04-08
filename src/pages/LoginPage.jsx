import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'

export default function LoginPage() {
    const navigate = useNavigate()
    const { login, loading } = useAuth()
    const { showToast } = useToast()
    const [lang, setLang] = useState('ar')
    const isAr = lang === 'ar'
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const t = {
        ar: {
            title: 'تسجيل الدخول',
            subtitle: 'أدخل بياناتك للوصول إلى حسابك',
            email: 'البريد الإلكتروني',
            password: 'كلمة المرور',
            submit: 'تسجيل الدخول',
            demo: 'بيانات تجريبية',
            demoEmail: 'البريد: admin@example.com',
            demoPass: 'كلمة المرور: demo123',
            back: 'العودة للرئيسية',
            welcome: 'مرحباً بك',
            noAccount: 'ليس لديك حساب؟',
            register: 'سجّل الآن',
        },
        en: {
            title: 'Sign In',
            subtitle: 'Enter your credentials to access your account',
            email: 'Email',
            password: 'Password',
            submit: 'Sign In',
            demo: 'Demo Credentials',
            demoEmail: 'Email: admin@example.com',
            demoPass: 'Password: demo123',
            back: 'Back to Home',
            welcome: 'Welcome back',
            noAccount: "Don't have an account?",
            register: 'Sign up',
        },
    }[lang]

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (email === 'admin@example.com' && password === 'demo123') {
            showToast(isAr ? 'تم تسجيل الدخول بنجاح!' : 'Logged in successfully!', 'success')
            navigate('/home')
        } else {
            showToast(isAr ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials', 'error')
        }
    }

    const fillDemo = () => {
        setEmail('admin@example.com')
        setPassword('demo123')
    }

    return (
        <div className={`min-h-screen bg-[#0a0a0a] text-white flex ${isAr ? 'font-tajawal' : ''}`}>
            <div className="hidden lg:flex flex-1 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gold/15 rounded-full blur-[120px]" />
                    <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gold/10 rounded-full blur-[100px]" />
                </div>
                <div className="relative flex flex-col items-center justify-center w-full p-12">
                    <div className="w-16 h-16 rounded-2xl bg-gold-gradient flex items-center justify-center mb-6">
                        <span className="text-black font-bold text-2xl">T</span>
                    </div>
                    <h1 className="text-4xl font-extrabold mb-4 text-gold-gradient">طلباتنا</h1>
                    <p className="text-gray-400 text-center max-w-sm">{isAr ? 'خدمة توصيل ذكية وسريعة تربط بين العملاء والمندوبين' : 'Smart, fast delivery connecting clients and couriers'}</p>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-extrabold">{t.title}</h2>
                            <p className="text-gray-400 text-sm mt-1">{t.subtitle}</p>
                        </div>
                        <button onClick={() => setLang(isAr ? 'en' : 'ar')} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-colors">
                            {isAr ? 'EN' : 'عربي'}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">{t.email}</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl bg-white/[0.02] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
                                placeholder="admin@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">{t.password}</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl bg-white/[0.02] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl bg-gold-gradient text-black font-bold hover:opacity-90 transition-opacity disabled:opacity-50">
                            {t.submit}
                        </button>
                    </form>

                    <div className="mt-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-gold font-bold">{t.demo}</p>
                            <button onClick={fillDemo} className="text-xs text-gold hover:underline">{isAr ? 'تعبئة تلقائية' : 'Auto-fill'}</button>
                        </div>
                        <p className="text-xs text-gray-500">{t.demoEmail}</p>
                        <p className="text-xs text-gray-500">{t.demoPass}</p>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                            ← {t.back}
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
