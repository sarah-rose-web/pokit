import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store'

import AuthPage       from './features/auth/AuthPage'
import OnboardingPage from './features/onboarding/OnboardingPage'
import HomePage       from './features/home/HomePage'
import AccountsPage   from './features/accounts/AccountsPage'
import PaycheckPage   from './features/paycheck/PaycheckPage'
import ExpensesPage   from './features/expenses/ExpensesPage'
import JarsPage       from './features/jars/JarsPage'
import GoalsPage      from './features/goals/GoalsPage'
import DebtsPage      from './features/debts/DebtsPage'
import CalendarPage   from './features/calendar/CalendarPage'
import OraclePage     from './features/oracle/OraclePage'
import SettingsPage   from './features/settings/SettingsPage'

/**
 * Blocks unauthenticated users from protected routes.
 * Redirects to /onboarding if the user has not completed setup yet.
 * @param {{ children: React.ReactNode }} props
 */
function AuthGuard({ children }) {
  const { user, profile, loading } = useAuthStore()

  if (loading) return <div className="app-loading" aria-label="Loading Pokit…" />
  if (!user)   return <Navigate to="/login" replace />

  // Profile loaded but onboarding not done — send to setup.
  // window.location check prevents redirect loop when already on /onboarding.
  const onOnboarding = window.location.pathname === '/onboarding'
  if (profile && !profile.onboardingDone && !onOnboarding) {
    return <Navigate to="/onboarding" replace />
  }

  return children
}

/**
 * Redirects logged-in users away from the auth page.
 * @param {{ children: React.ReactNode }} props
 */
function GuestGuard({ children }) {
  const { user, loading } = useAuthStore()

  if (loading) return <div className="app-loading" aria-label="Loading Pokit…" />
  if (user)    return <Navigate to="/" replace />
  return children
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<GuestGuard><AuthPage /></GuestGuard>} />

      {/* Onboarding — auth required but outside main nav */}
      <Route path="/onboarding" element={<AuthGuard><OnboardingPage /></AuthGuard>} />

      {/* Main rooms */}
      <Route path="/"          element={<AuthGuard><HomePage /></AuthGuard>} />
      <Route path="/accounts"  element={<AuthGuard><AccountsPage /></AuthGuard>} />
      <Route path="/paycheck"  element={<AuthGuard><PaycheckPage /></AuthGuard>} />
      <Route path="/expenses"  element={<AuthGuard><ExpensesPage /></AuthGuard>} />
      <Route path="/jars"      element={<AuthGuard><JarsPage /></AuthGuard>} />
      <Route path="/goals"     element={<AuthGuard><GoalsPage /></AuthGuard>} />
      <Route path="/debts"     element={<AuthGuard><DebtsPage /></AuthGuard>} />
      <Route path="/calendar"  element={<AuthGuard><CalendarPage /></AuthGuard>} />
      <Route path="/oracle"    element={<AuthGuard><OraclePage /></AuthGuard>} />
      <Route path="/settings"  element={<AuthGuard><SettingsPage /></AuthGuard>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
