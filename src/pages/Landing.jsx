import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const content = {
    ar: {
        nav: {
            home: 'الرئيسية',
            features: 'المميزات',
            howItWorks: 'كيف يعمل',
            pricing: 'الأسعار',
            contact: 'تواصل معنا',
            login: 'تسجيل الدخول',
        },
        hero: {
            badge: 'خدمة توصيل ذكية',
            title: 'توصيلاتك',
            titleHighlight: 'بسرعة الضوء',
            subtitle: 'منصة متكاملة لخدمات التوصيل تجمع بين العملاء والمندوبين في تجربة سلسة وآمنة',
            cta: 'ابدأ الآن',
            ctaSecondary: 'تعرف أكثر',
        },
        features: {
            title: 'مميزات',
            titleHighlight: 'استثنائية',
            subtitle: 'نقدم لك تجربة توصيل متكاملة مع مميزات فريدة',
            items: [
                {
                    icon: '🚀',
                    title: 'سرعة فائقة',
                    desc: 'توصيل خلال دقائق مع تتبع لحظي للمندوب',
                },
                {
                    icon: '📍',
                    title: 'تتبع مباشر',
                    desc: 'راقب طلبك على الخريطة في الوقت الفعلي',
                },
                {
                    icon: '💳',
                    title: 'محفظة رقمية',
                    desc: 'شحن رصيدك ودفع إلكترونياً بكل سهولة',
                },
                {
                    icon: '⭐',
                    title: 'تقييم شامل',
                    desc: 'قيّم الخدمة وساعدنا في تحسين التجربة',
                },
                {
                    icon: '🔔',
                    title: 'إشعارات ذكية',
                    desc: 'تنبيهات فورية لكل تحديث في طلبك',
                },
                {
                    icon: '🛡️',
                    title: 'أمان تام',
                    desc: 'حماية بياناتك ومدفوعاتك بأحدث التقنيات',
                },
            ],
        },
        howItWorks: {
            title: 'كيف',
            titleHighlight: 'يعمل',
            subtitle: 'ثلاث خطوات بسيطة للحصول على طلبك',
            steps: [
                { num: '01', title: 'أنشئ طلبك', desc: 'حدد نوع الطلب والموقع والمتجر المطلوب' },
                { num: '02', title: 'اختر مندوباً', desc: 'نختار لك أقرب مندوب متاح تلقائياً' },
                { num: '03', title: 'استلم طلبك', desc: 'تتبع التوصيل واستلمه على باب منزلك' },
            ],
        },
        pricing: {
            title: 'خطط',
            titleHighlight: 'الأسعار',
            subtitle: 'أسعار تنافسية تناسب جميع الاحتياجات',
            plans: [
                {
                    name: 'أساسي',
                    price: 'مجاني',
                    period: '',
                    features: ['5 طلبات شهرياً', 'تتبع مباشر', 'دعم فني عبر التطبيق'],
                    popular: false,
                },
                {
                    name: 'احترافي',
                    price: '49',
                    period: 'ر.س/شهر',
                    features: ['طلبات غير محدودة', 'أولوية التوصيل', 'خصم 10% على كل طلب', 'دعم فني 24/7'],
                    popular: true,
                },
                {
                    name: 'أعمال',
                    price: '199',
                    period: 'ر.س/شهر',
                    features: ['حساب تجاري مخصص', 'API للمطورين', 'تقارير تحليلية', 'مدير حساب خاص'],
                    popular: false,
                },
            ],
        },
        contact: {
            title: 'تواصل',
            titleHighlight: 'معنا',
            subtitle: 'نحن هنا لمساعدتك على مدار الساعة',
            form: {
                name: 'الاسم',
                email: 'البريد الإلكتروني',
                message: 'رسالتك',
                send: 'إرسال',
            },
        },
        footer: {
            rights: 'جميع الحقوق محفوظة',
            made: 'صُنع بـ ❤️',
        },
    },
    en: {
        nav: {
            home: 'Home',
            features: 'Features',
            howItWorks: 'How it Works',
            pricing: 'Pricing',
            contact: 'Contact',
            login: 'Login',
        },
        hero: {
            badge: 'Smart Delivery Service',
            title: 'Your Deliveries,',
            titleHighlight: 'Lightning Fast',
            subtitle: 'A comprehensive delivery platform connecting clients and couriers in a seamless, secure experience',
            cta: 'Get Started',
            ctaSecondary: 'Learn More',
        },
        features: {
            title: 'Exceptional',
            titleHighlight: 'Features',
            subtitle: 'We offer a complete delivery experience with unique features',
            items: [
                {
                    icon: '🚀',
                    title: 'Super Fast',
                    desc: 'Delivery within minutes with real-time courier tracking',
                },
                {
                    icon: '📍',
                    title: 'Live Tracking',
                    desc: 'Track your order on the map in real-time',
                },
                {
                    icon: '💳',
                    title: 'Digital Wallet',
                    desc: 'Top up your balance and pay electronically with ease',
                },
                {
                    icon: '⭐',
                    title: 'Rating System',
                    desc: 'Rate the service and help us improve the experience',
                },
                {
                    icon: '🔔',
                    title: 'Smart Notifications',
                    desc: 'Instant alerts for every update on your order',
                },
                {
                    icon: '🛡️',
                    title: 'Full Security',
                    desc: 'Protect your data and payments with the latest technology',
                },
            ],
        },
        howItWorks: {
            title: 'How it',
            titleHighlight: 'Works',
            subtitle: 'Three simple steps to get your order',
            steps: [
                { num: '01', title: 'Create Order', desc: 'Specify order type, location and desired store' },
                { num: '02', title: 'Get Courier', desc: 'We automatically select the nearest available courier' },
                { num: '03', title: 'Receive Order', desc: 'Track delivery and receive it at your doorstep' },
            ],
        },
        pricing: {
            title: 'Pricing',
            titleHighlight: 'Plans',
            subtitle: 'Competitive prices to suit all needs',
            plans: [
                {
                    name: 'Basic',
                    price: 'Free',
                    period: '',
                    features: ['5 orders monthly', 'Live tracking', 'In-app support'],
                    popular: false,
                },
                {
                    name: 'Pro',
                    price: '49',
                    period: 'SAR/month',
                    features: ['Unlimited orders', 'Priority delivery', '10% off every order', '24/7 support'],
                    popular: true,
                },
                {
                    name: 'Business',
                    price: '199',
                    period: 'SAR/month',
                    features: ['Dedicated business account', 'Developer API', 'Analytics reports', 'Account manager'],
                    popular: false,
                },
            ],
        },
        contact: {
            title: 'Get in',
            titleHighlight: 'Touch',
            subtitle: 'We are here to help you 24/7',
            form: {
                name: 'Name',
                email: 'Email',
                message: 'Message',
                send: 'Send',
            },
        },
        footer: {
            rights: 'All rights reserved',
            made: 'Made with ❤️',
        },
    },
}

function IPhoneMockup({ lang }) {
    return (
        <div className="relative">
            <div className="absolute inset-0 bg-gold/20 blur-[80px] rounded-full" />
            <div className="relative w-[280px] h-[580px] bg-black rounded-[50px] p-3 shadow-2xl border-4 border-gray-800">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-10" />
                <div className="w-full h-full bg-[#0a0a0a] rounded-[40px] overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent" />
                    <div className="p-4 pt-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gold-gradient" />
                                <span className="text-white font-bold text-sm">طلباتنا</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/10" />
                        </div>
                        <div className="bg-[var(--bg-elevated)] rounded-2xl p-4 mb-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                                    <span className="text-lg">📦</span>
                                </div>
                                <div>
                                    <p className="text-white text-sm font-medium">طلب جديد</p>
                                    <p className="text-gray-500 text-xs">منذ 5 دقائق</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                <span>{lang === 'ar' ? 'جاري التوصيل' : 'In Transit'}</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="h-3 bg-white/5 rounded-full w-full" />
                            <div className="h-3 bg-white/5 rounded-full w-3/4" />
                            <div className="h-3 bg-white/5 rounded-full w-1/2" />
                        </div>
                        <div className="mt-6 bg-gold-gradient rounded-2xl p-3 text-center">
                            <p className="text-black text-sm font-bold">{lang === 'ar' ? 'اطلب الآن' : 'Order Now'}</p>
                        </div>
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full" />
                </div>
            </div>
        </div>
    )
}

export default function Landing() {
    const [lang, setLang] = useState('ar')
    const [scrolled, setScrolled] = useState(false)
    const t = content[lang]
    const isAr = lang === 'ar'

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        document.documentElement.dir = isAr ? 'rtl' : 'ltr'
        document.documentElement.lang = lang
    }, [lang, isAr])

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className={`min-h-screen bg-[#0a0a0a] text-white ${isAr ? 'font-tajawal' : ''}`}>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : ''}`}>
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center">
                                <span className="text-black font-bold text-lg">T</span>
                            </div>
                            <span className="font-bold text-xl">طلباتنا</span>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            {['features', 'howItWorks', 'pricing', 'contact'].map((id) => (
                                <button key={id} onClick={() => scrollTo(id)} className="text-gray-400 hover:text-white transition-colors">
                                    {t.nav[id]}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setLang(isAr ? 'en' : 'ar')} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-colors">
                                {isAr ? 'EN' : 'عربي'}
                            </button>
                            <Link to="/login" className="px-5 py-2 rounded-xl bg-gold-gradient text-black font-bold text-sm hover:opacity-90 transition-opacity">
                                {t.nav.login}
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-[100px]" />
                </div>
                <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div initial={{ opacity: 0, x: isAr ? 50 : -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
                            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                            <span className="text-gold text-sm font-medium">{t.hero.badge}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                            {t.hero.title}
                            <span className="text-gold-gradient block">{t.hero.titleHighlight}</span>
                        </h1>
                        <p className="text-gray-400 text-lg mb-8 max-w-lg">{t.hero.subtitle}</p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/login" className="px-8 py-4 rounded-2xl bg-gold-gradient text-black font-bold hover:opacity-90 transition-opacity">
                                {t.hero.cta}
                            </Link>
                            <button onClick={() => scrollTo('features')} className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                {t.hero.ctaSecondary}
                            </button>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex justify-center">
                        <IPhoneMockup lang={lang} />
                    </motion.div>
                </div>
            </section>

            <section id="features" className="py-24 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                            {t.features.title} <span className="text-gold-gradient">{t.features.titleHighlight}</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">{t.features.subtitle}</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {t.features.items.map((feature, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-gold/20 transition-colors group">
                                <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                                <p className="text-gray-400 text-sm">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="howItWorks" className="py-24 bg-gradient-to-b from-transparent via-gold/[0.02] to-transparent">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                            {t.howItWorks.title} <span className="text-gold-gradient">{t.howItWorks.titleHighlight}</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">{t.howItWorks.subtitle}</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {t.howItWorks.steps.map((step, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} className="relative">
                                <div className="text-6xl font-extrabold text-gold/10 absolute -top-4 start-0">{step.num}</div>
                                <div className="pt-8 ps-4">
                                    <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center mb-4 text-black font-bold">{i + 1}</div>
                                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                    <p className="text-gray-400">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="pricing" className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                            {t.pricing.title} <span className="text-gold-gradient">{t.pricing.titleHighlight}</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">{t.pricing.subtitle}</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {t.pricing.plans.map((plan, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`relative p-8 rounded-3xl ${plan.popular ? 'bg-gold-gradient' : 'bg-white/[0.02] border border-white/5'}`}>
                                {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-black text-gold text-xs font-bold">{isAr ? 'الأكثر شعبية' : 'Most Popular'}</div>}
                                <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-black' : ''}`}>{plan.name}</h3>
                                <div className="mb-6">
                                    <span className={`text-4xl font-extrabold ${plan.popular ? 'text-black' : ''}`}>{plan.price}</span>
                                    <span className={`text-sm ${plan.popular ? 'text-black/70' : 'text-gray-400'}`}> {plan.period}</span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((f, j) => (
                                        <li key={j} className={`flex items-center gap-2 text-sm ${plan.popular ? 'text-black/80' : 'text-gray-400'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${plan.popular ? 'bg-black' : 'bg-gold'}`} />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <button className={`w-full py-3 rounded-xl font-bold transition-opacity hover:opacity-90 ${plan.popular ? 'bg-black text-gold' : 'bg-gold-gradient text-black'}`}>
                                    {isAr ? 'ابدأ الآن' : 'Get Started'}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="contact" className="py-24 bg-gradient-to-b from-transparent via-gold/[0.02] to-transparent">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                            {t.contact.title} <span className="text-gold-gradient">{t.contact.titleHighlight}</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">{t.contact.subtitle}</p>
                    </div>
                    <div className="max-w-xl mx-auto">
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <input type="text" placeholder={t.contact.form.name} className="w-full px-5 py-4 rounded-2xl bg-white/[0.02] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors" />
                            <input type="email" placeholder={t.contact.form.email} className="w-full px-5 py-4 rounded-2xl bg-white/[0.02] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors" />
                            <textarea placeholder={t.contact.form.message} rows={4} className="w-full px-5 py-4 rounded-2xl bg-white/[0.02] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors resize-none" />
                            <button type="submit" className="w-full py-4 rounded-2xl bg-gold-gradient text-black font-bold hover:opacity-90 transition-opacity">
                                {t.contact.form.send}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <footer className="py-8 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center">
                            <span className="text-black font-bold text-sm">T</span>
                        </div>
                        <span className="font-bold">طلباتنا</span>
                    </div>
                    <p className="text-gray-500 text-sm">
                        © 2024 طلباتنا. {t.footer.rights}.
                    </p>
                    <p className="text-gray-500 text-sm">{t.footer.made}</p>
                </div>
            </footer>
        </div>
    )
}
