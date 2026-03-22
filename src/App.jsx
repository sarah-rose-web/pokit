import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './router'
import { useAuthStore } from './store'
import ToastContainer from './components/Toast'

/**
 * Reads saved theme + graveyard preference from localStorage and
 * applies them to <html> before first paint to avoid flash.
 */
function applyStoredTheme() {
  const theme = localStorage.getItem('pokit-theme') || 'light'
  const graveyard = localStorage.getItem('pokit-graveyard') === 'true'
  document.documentElement.setAttribute('data-theme', theme)
  if (graveyard) document.documentElement.setAttribute('data-graveyard', 'true')
}

applyStoredTheme()

export default function App() {
  const { subscribeToAuthChanges } = useAuthStore()

  useEffect(() => {
    // Returns an unsubscribe function — clean up on unmount
    const unsub = subscribeToAuthChanges()
    return unsub
  }, [subscribeToAuthChanges])

  return (
    <BrowserRouter>
      <AppRouter />
      <ToastContainer />
    </BrowserRouter>
  )
}
