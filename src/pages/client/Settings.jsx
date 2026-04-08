import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Moon, Sun, Bell, Lock, LogOut, MessageSquare,
    Star, Info, ChevronLeft, User
} from 'lucide-react'
import { ScreenWrapper } from '../../components/layout/ScreenWrapper'
import { TopBar } from '../../components/layout/TopBar'
import { BottomNav } from '../../components/layout/BottomNav'
import { Toggle } from '../../components/ui/Toggle'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { StarRating } from '../../components/forms/StarRating'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { getInitials, formatPhone } from '../../utils/formatters'
import useStore from '../../store/useStore'

/**
 * Settings page with profile, preferences, account, and support sections.
 */
export default function Settings() {
    const navigate = useNavigate()
    const { profile, logout } = useAuth()
    const { showToast } = useToast()
    const isDarkMode = useStore((s) => s.isDarkMode)
    const toggleTheme = useStore((s) => s.toggleTheme)

    const [passwordModal, setPasswordModal] = useState(false)
    const [logoutModal, setLogoutModal] = useState(false)
    const [rateModal, setRateModal] = useState(false)
    const [aboutModal, setAboutModal] = useState(false)
    const [appRating, setAppRating] = useState(0)

    const handleLogout = async () => {
        await logout()
        navigate('/auth')
    }

    const MenuItem = ({ icon: Icon, label, onClick, action }) => (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between py-3.5 border-b border-[var(--border-subtle)] last:border-0"
        >
            <div className="flex items-center gap-3">
                <Icon size={18} className="text-[var(--text-muted)]" />
                <span className="text-sm text-[var(--text-primary)]">{label}</span>
            </div>
            {action || <ChevronLeft size={16} className="text-[var(--text-muted)]" />}
        </button>
    )

    return (
        <ScreenWrapper>
            <TopBar title="الإعدادات" />

            <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
                {/* Profile header */}
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-xl">
                        {profile ? getInitials(profile.full_name) : <User size={28} />}
                    </div>
                    <div>
                        <p className="font-bold text-[var(--text-primary)]">{profile?.full_name || 'المستخدم'}</p>
                        <p className="text-sm text-[var(--text-secondary)]">
                            {profile?.phone ? formatPhone(profile.phone) : ''}
                        </p>
                    </div>
                </div>

                {/* Preferences */}
                <div className="glass rounded-2xl p-4">
                    <h3 className="text-sm font-bold text-[var(--text-muted)] mb-2">التفضيلات</h3>
                    <div className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)]">
                        <div className="flex items-center gap-3">
                            {isDarkMode ? <Moon size={18} className="text-[var(--text-muted)]" /> : <Sun size={18} className="text-[var(--text-muted)]" />}
                            <span className="text-sm text-[var(--text-primary)]">المظهر</span>
                        </div>
                        <Toggle enabled={isDarkMode} onChange={toggleTheme} />
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                            <Bell size={18} className="text-[var(--text-muted)]" />
                            <span className="text-sm text-[var(--text-primary)]">الإشعارات</span>
                        </div>
                        <Toggle enabled={true} onChange={() => showToast('سيتم إضافة الإشعارات قريباً', 'info')} />
                    </div>
                </div>

                {/* Account */}
                <div className="glass rounded-2xl p-4">
                    <h3 className="text-sm font-bold text-[var(--text-muted)] mb-2">الحساب</h3>
                    <MenuItem icon={Lock} label="تغيير كلمة المرور" onClick={() => setPasswordModal(true)} />
                    <MenuItem icon={LogOut} label="تسجيل الخروج" onClick={() => setLogoutModal(true)} />
                </div>

                {/* Support */}
                <div className="glass rounded-2xl p-4">
                    <h3 className="text-sm font-bold text-[var(--text-muted)] mb-2">الدعم</h3>
                    <MenuItem icon={MessageSquare} label="تواصل معنا" onClick={() => showToast('سيتم إضافة التواصل قريباً', 'info')} />
                    <MenuItem icon={Star} label="قيّم التطبيق" onClick={() => setRateModal(true)} />
                    <MenuItem icon={Info} label="عن التطبيق" onClick={() => setAboutModal(true)} />
                </div>
            </div>

            {/* Modals */}
            <Modal isOpen={passwordModal} onClose={() => setPasswordModal(false)} title="تغيير كلمة المرور">
                <div className="space-y-3">
                    <Input label="كلمة المرور الحالية" type="password" placeholder="••••••" />
                    <Input label="كلمة المرور الجديدة" type="password" placeholder="••••••" />
                    <Input label="تأكيد كلمة المرور" type="password" placeholder="••••••" />
                    <Button fullWidth onClick={() => { showToast('سيتم إضافة الميزة قريباً', 'info'); setPasswordModal(false) }}>
                        تحديث
                    </Button>
                </div>
            </Modal>

            <Modal isOpen={logoutModal} onClose={() => setLogoutModal(false)} title="تسجيل الخروج">
                <p className="text-sm text-[var(--text-secondary)] mb-4">هل أنت متأكد من تسجيل الخروج؟</p>
                <div className="flex gap-3">
                    <Button variant="danger" fullWidth onClick={handleLogout}>نعم، خروج</Button>
                    <Button variant="ghost" fullWidth onClick={() => setLogoutModal(false)}>إلغاء</Button>
                </div>
            </Modal>

            <Modal isOpen={rateModal} onClose={() => setRateModal(false)} title="قيّم التطبيق">
                <div className="text-center py-4">
                    <StarRating value={appRating} onChange={setAppRating} size={36} className="justify-center" />
                    <Button className="mt-4" fullWidth onClick={() => { showToast('شكراً لتقييمك!', 'success'); setRateModal(false) }}>
                        إرسال
                    </Button>
                </div>
            </Modal>

            <Modal isOpen={aboutModal} onClose={() => setAboutModal(false)} title="عن التطبيق">
                <div className="text-center py-4">
                    <p className="text-2xl font-extrabold text-gold-gradient mb-2">طلباتنا</p>
                    <p className="text-sm text-[var(--text-secondary)]">الإصدار 1.0.0</p>
                    <p className="text-xs text-[var(--text-muted)] mt-2">خدمة توصيل ذكية وسريعة</p>
                </div>
            </Modal>

            <BottomNav />
        </ScreenWrapper>
    )
}