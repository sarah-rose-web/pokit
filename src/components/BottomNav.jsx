import { NavLink } from 'react-router-dom'
import './BottomNav.css'

const NAV_ITEMS = [
  { to: '/',         label: 'Home',     icon: '🏠' },
  { to: '/accounts', label: 'Accounts', icon: '👛' },
  { to: '/paycheck', label: 'Paycheck', icon: '🍳' },
  { to: '/expenses', label: 'Expenses', icon: '🧾' },
  { to: '/jars',     label: 'Jars',     icon: '🍯' },
]

const MORE_ITEMS = [
  { to: '/goals',    label: 'Goals',    icon: '⭐' },
  { to: '/debts',    label: 'Debts',    icon: '📓' },
  { to: '/calendar', label: 'Calendar', icon: '📌' },
  { to: '/oracle',   label: 'Oracle',   icon: '🔮' },
  { to: '/settings', label: 'Settings', icon: '🔧' },
]

/**
 * Bottom navigation bar. Shows 5 primary rooms.
 * On small screens all rooms are accessible; overflow rooms available via settings.
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
          <span className="bottom-nav__icon" aria-hidden="true">{icon}</span>
          <span className="bottom-nav__label">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
