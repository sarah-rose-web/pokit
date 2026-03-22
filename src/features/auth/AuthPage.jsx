import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInEmail, signUpEmail, signInGoogle, resetPassword } from '@/firebase/auth'
import Pokkie from '@/components/Pokkie'
import { toast } from '@/components/Toast'
import './auth.css'

/**
 * @typedef {'login'|'signup'|'reset'} AuthMode
 */

export default function AuthPage() {
  const navigate = useNavigate()

  /** @type {[AuthMode, Function]} */
  const [mode, setMode]       = useState('login')
  const [email, setEmail]     = useState('')
  const [password, setPass]   = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [pokkieExp, setPokkieExp] = useState('neutral')

  const isLogin  = mode === 'login'
  const isSignup = mode === 'signup'
  const isReset  = mode === 'reset'

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      if (isReset) {
        await resetPassword(email)
        toast.success('Check your email for a reset link!')
        setMode('login')
        return
      }

      if (isSignup) {
        if (password !== confirm) {
          toast.error("Passwords don't match.")
          setPokkieExp('surprised')
          return
        }
        if (password.length < 8) {
          toast.error('Password must be at least 8 characters.')
          return
        }
        await signUpEmail(email, password)
        navigate('/onboarding')
        return
      }

      await signInEmail(email, password)
      navigate('/')
    } catch (err) {
      toast.error(friendlyError(err.code))
      setPokkieExp('surprised')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setLoading(true)
    try {
      await signInGoogle()
      navigate('/')
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        toast.error('Google sign-in failed. Try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page page-enter">
      <div className="auth-card">

        <div className="auth-header">
          <Pokkie size={80} expression={pokkieExp} className="animate-float" />
          <h1 className="auth-logo">Pokit</h1>
          <p className="auth-tagline">every peso has a job</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {!isReset && (
            <div className="auth-tabs">
              <button
                type="button"
                className={`auth-tab${isLogin ? ' auth-tab--active' : ''}`}
                onClick={() => { setMode('login'); setPokkieExp('neutral') }}
              >Log in</button>
              <button
                type="button"
                className={`auth-tab${isSignup ? ' auth-tab--active' : ''}`}
                onClick={() => { setMode('signup'); setPokkieExp('neutral') }}
              >Sign up</button>
            </div>
          )}

          {isReset && (
            <h2 className="auth-reset-title">Reset password</h2>
          )}

          <div className="field">
            <label className="label" htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              className="input"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {!isReset && (
            <div className="field">
              <label className="label" htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                className="input"
                type="password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                placeholder={isSignup ? 'At least 8 characters' : '••••••••'}
                value={password}
                onChange={(e) => setPass(e.target.value)}
                required
              />
            </div>
          )}

          {isSignup && (
            <div className="field">
              <label className="label" htmlFor="auth-confirm">Confirm password</label>
              <input
                id="auth-confirm"
                className="input"
                type="password"
                autoComplete="new-password"
                placeholder="Same password again"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn--primary btn--full"
            disabled={loading}
          >
            {loading
              ? 'Just a sec…'
              : isReset
                ? 'Send reset link'
                : isLogin
                  ? 'Log in'
                  : 'Create account'}
          </button>

          {isLogin && (
            <button type="button" className="auth-forgot" onClick={() => setMode('reset')}>
              Forgot password?
            </button>
          )}

          {isReset && (
            <button type="button" className="auth-forgot" onClick={() => setMode('login')}>
              ← Back to login
            </button>
          )}
        </form>

        {!isReset && (
          <>
            <div className="auth-divider"><span>or</span></div>
            <button
              type="button"
              className="btn btn--secondary btn--full auth-google"
              onClick={handleGoogle}
              disabled={loading}
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </>
        )}

      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

/**
 * @param {string} code
 * @returns {string}
 */
function friendlyError(code) {
  const map = {
    'auth/invalid-email':          "That doesn't look like a valid email.",
    'auth/user-not-found':         'No account found with that email.',
    'auth/wrong-password':         'Wrong password. Try again.',
    'auth/invalid-credential':     'Email or password is incorrect.',
    'auth/email-already-in-use':   'An account with that email already exists.',
    'auth/weak-password':          'Password is too weak. Use at least 8 characters.',
    'auth/too-many-requests':      'Too many attempts. Try again later.',
    'auth/network-request-failed': 'No internet connection.',
  }
  return map[code] ?? 'Something went wrong. Please try again.'
}
