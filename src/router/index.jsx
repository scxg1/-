import { useContext, createContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Spinner } from '../components/ui/Spinner'
import { USER_ROLES } from '../constants'

import Landing from '../pages/Landing'
import LoginPage from '../pages/LoginPage'
import Auth from '../pages/Auth'
import Home from '../pages/client/Home'
import OrderFormA from '../pages/client/OrderFormA'
import OrderFormB from '../pages/client/OrderFormB'
import Tracking from '../pages/client/Tracking'
import Orders from '../pages/client/Orders'
import Wallet from '../pages/client/Wallet'
import Settings from '../pages/client/Settings'
import CourierHome from '../pages/courier/CourierHome'
import ActiveDelivery from '../pages/courier/ActiveDelivery'
import CourierWallet from '../pages/courier/CourierWallet'

const AuthContext = createContext(null)

function AuthProvider({ children }) {
    const auth = useAuth()
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

function useAuthContext() {
    return useContext(AuthContext)
}

function LoadingScreen() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Spinner size="lg" />
        </div>
    )
}

function PrivateRoute({ children }) {
    const { isAuthenticated, loading } = useAuthContext()
    if (loading) return <LoadingScreen />
    if (!isAuthenticated) return <Navigate to="/auth" replace />
    return children
}

function RoleRoute({ role, children }) {
    const { profile, loading } = useAuthContext()
    if (loading) return <LoadingScreen />
    if (profile?.role !== role) {
        return <Navigate to={profile?.role === USER_ROLES.COURIER ? '/courier' : '/home'} replace />
    }
    return children
}

function PublicRoute({ children }) {
    const { isAuthenticated, profile, loading } = useAuthContext()
    if (loading) return <LoadingScreen />
    if (isAuthenticated) {
        return <Navigate to={profile?.role === USER_ROLES.COURIER ? '/courier' : '/home'} replace />
    }
    return children
}

export function RouterProvider() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
                <Route path="/home" element={<PrivateRoute><RoleRoute role={USER_ROLES.CLIENT}><Home /></RoleRoute></PrivateRoute>} />
                <Route path="/order/new/a" element={<PrivateRoute><RoleRoute role={USER_ROLES.CLIENT}><OrderFormA /></RoleRoute></PrivateRoute>} />
                <Route path="/order/new/b" element={<PrivateRoute><RoleRoute role={USER_ROLES.CLIENT}><OrderFormB /></RoleRoute></PrivateRoute>} />
                <Route path="/tracking/:orderId" element={<PrivateRoute><RoleRoute role={USER_ROLES.CLIENT}><Tracking /></RoleRoute></PrivateRoute>} />
                <Route path="/orders" element={<PrivateRoute><RoleRoute role={USER_ROLES.CLIENT}><Orders /></RoleRoute></PrivateRoute>} />
                <Route path="/wallet" element={<PrivateRoute><RoleRoute role={USER_ROLES.CLIENT}><Wallet /></RoleRoute></PrivateRoute>} />
                <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                <Route path="/courier" element={<PrivateRoute><RoleRoute role={USER_ROLES.COURIER}><CourierHome /></RoleRoute></PrivateRoute>} />
                <Route path="/courier/delivery" element={<PrivateRoute><RoleRoute role={USER_ROLES.COURIER}><ActiveDelivery /></RoleRoute></PrivateRoute>} />
                <Route path="/courier/wallet" element={<PrivateRoute><RoleRoute role={USER_ROLES.COURIER}><CourierWallet /></RoleRoute></PrivateRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AuthProvider>
    )
}
