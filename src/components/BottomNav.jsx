import { NavLink } from 'react-router-dom'
import './BottomNav.css'

const icons = {
  Home: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L11 3l8 6.5V19a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z" />
      <path d="M8 20v-7h6v7" />
    </svg>
  ),
  Accounts: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="18" height="13" rx="2" />
      <path d="M2 10h18" />
      <path d="M6 15h2" />
      <path d="M10 15h4" />
      <path d="M6 3l2.5 3M16 3l-2.5 3" />
    </svg>
  ),
  Paycheck: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="16" height="14" rx="2" />
      <path d="M7 9h8" />
      <path d="M7 12h5" />
      <path d="M11 16v-1.5a1.5 1.5 0 0 1 3 0V16" />
      <path d="M8 16h6" />
    </svg>
  ),
  Expenses: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2h10a1 1 0 0 1 1 1v16l-2-1.5L13 19l-2-1.5L9 19l-2-1.5L5 19V3a1 1 0 0 1 1-1Z" />
      <path d="M9 7h6" />
      <path d="M9 10.5h6" />
      <path d="M9 14h4" />
    </svg>
  ),
  Jars: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="2" width="8" height="3" rx="1" />
      <path d="M5 5h12l-1.5 13a1 1 0 0 1-1 .9H7.5a1 1 0 0 1-1-.9L5 5Z" />
      <path d="M8.5 11c.5-1 1.5-1.5 2.5-1s2 1.5 2.5 1" />
    </svg>
  ),
}

const NAV_ITEMS = [
  { to: '/',         label: 'Home',     icon: 'Home' },
  { to: '/accounts', label: 'Accounts', icon: 'Accounts' },
  { to: '/paycheck', label: 'Paycheck', icon: 'Paycheck' },
  { to: '/expenses', label: 'Expenses', icon: 'Expenses' },
  { to: '/jars',     label: 'Jars',     icon: 'Jars' },
]

/**
 * Bottom navigation bar. Shows 5 primary rooms.
 */
export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {NAV_ITEMS.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `bottom-nav__item${isActive ? ' bottom-nav__item--active' : ''}`
          }
          aria-label={label}
        >
          <span className="bottom-nav__icon" aria-hidden="true">{icons[icon]}</span>
          <span className="bottom-nav__label">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
