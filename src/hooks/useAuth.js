import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../config/supabase'
import { useToast } from './useToast'
import { DEMO_CLIENT, DEMO_COURIER } from '../utils/sampleData'

/**
 * Handles all authentication operations.
 * @returns {{ user: object|null, profile: object|null, loading: boolean, isAuthenticated: boolean, login: function, register: function, logout: function }}
 */
export function useAuth() {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const { showToast } = useToast()

    const fetchProfile = async (userId) => {
        if (!isSupabaseConfigured()) return null
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) throw error
            setProfile(data)
            return data
        } catch {
            return null
        }
    }

    useEffect(() => {
        const getSession = async () => {
            // Check for demo mode first
            const demoUser = localStorage.getItem('demo_user')
            if (demoUser) {
                const userData = JSON.parse(demoUser)
                setUser({ id: userData.id })
                setProfile(userData.profile)
                setLoading(false)
                return
            }

            if (!isSupabaseConfigured()) {
                setLoading(false)
                return
            }
            try {
                const { data: { session } } = await supabase.auth.getSession()
                setUser(session?.user ?? null)
                if (session?.user) await fetchProfile(session.user.id)
            } catch {
                // Silently fail if Supabase isn't configured
            } finally {
                setLoading(false)
            }
        }

        getSession()

        if (isSupabaseConfigured()) {
            const { data: { subscription } } = supabase.auth.onAuthStateChange(
                async (_event, session) => {
                    setUser(session?.user ?? null)
                    if (session?.user) {
                        await fetchProfile(session.user.id)
                    } else {
                        setProfile(null)
                    }
                }
            )

            return () => subscription.unsubscribe()
        }
    }, [])

    const login = async (phone, password) => {
        setLoading(true)
        try {
            // Check for demo credentials
            if (phone === DEMO_CLIENT.phone && password === DEMO_CLIENT.password) {
                const demoUserData = {
                    id: 'demo-client-' + Date.now(),
                    profile: {
                        id: 'demo-client-' + Date.now(),
                        full_name: DEMO_CLIENT.name,
                        phone: DEMO_CLIENT.phone,
                        role: 'client',
                    }
                }
                localStorage.setItem('demo_user', JSON.stringify(demoUserData))
                setUser({ id: demoUserData.id })
                setProfile(demoUserData.profile)
                showToast('تم تسجيل الدخول بنجاح (وضع تجريبي)', 'success')
                setLoading(false)
                return
            }

            if (phone === DEMO_COURIER.phone && password === DEMO_COURIER.password) {
                const demoUserData = {
                    id: 'demo-courier-' + Date.now(),
                    profile: {
                        id: 'demo-courier-' + Date.now(),
                        full_name: DEMO_COURIER.name,
                        phone: DEMO_COURIER.phone,
                        role: 'courier',
                    }
                }
                localStorage.setItem('demo_user', JSON.stringify(demoUserData))
                setUser({ id: demoUserData.id })
                setProfile(demoUserData.profile)
                showToast('تم تسجيل الدخول بنجاح (وضع تجريبي)', 'success')
                setLoading(false)
                return
            }

            // If not demo, try Supabase
            if (!isSupabaseConfigured()) {
                showToast('بيانات الدخول غير صحيحة', 'error')
                setLoading(false)
                throw new Error('Invalid credentials')
            }

            const email = `${phone}@delivery.app`
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) throw error
            showToast('تم تسجيل الدخول بنجاح', 'success')
        } catch (err) {
            // Only show error toast if we haven't already shown one
            if (err.message !== 'Invalid credentials') {
                showToast('خطأ في تسجيل الدخول', 'error')
            }
            throw err
        } finally {
            setLoading(false)
        }
    }

    const register = async (fullName, phone, password, role) => {
        setLoading(true)
        try {
            if (!isSupabaseConfigured()) {
                showToast('يجب إعداد Supabase لإنشاء حساب جديد', 'error')
                setLoading(false)
                throw new Error('Supabase not configured')
            }

            const email = `${phone}@delivery.app`
            const { data, error } = await supabase.auth.signUp({ email, password })
            if (error) throw error

            const userId = data.user.id
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: userId,
                    full_name: fullName,
                    phone,
                    role,
                })

            if (profileError) throw profileError
            showToast('تم إنشاء الحساب بنجاح', 'success')
        } catch (err) {
            showToast(err.message || 'خطأ في إنشاء الحساب', 'error')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        try {
            // Clear demo mode
            localStorage.removeItem('demo_user')

            if (isSupabaseConfigured()) {
                await supabase.auth.signOut()
            }
            setUser(null)
            setProfile(null)
            showToast('تم تسجيل الخروج', 'info')
        } catch {
            showToast('خطأ في تسجيل الخروج', 'error')
        }
    }

    return {
        user,
        profile,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
    }
}