import { useState }          from 'react'
import { getSkin }          from '@/config/cardSkins'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'

/**
 * Compact wallet tile for the 2-column tile grid view.
 * Plain box with a small photo/logo thumbnail, balance, and name.
 * Edit / Delete icon buttons on top-right.
 * Main click → opens the detail drawer (onOpen).
 *
 * @param {{
 *   account:  import('@/store/accountsStore').Account,
 *   onOpen:   (account: import('@/store/accountsStore').Account) => void,
 *   onEdit:   (account: import('@/store/accountsStore').Account) => void,
 *   onDelete: (id: string) => void,
 * }} props
 */
export default function WalletTile({ account, onOpen, onEdit, onDelete }) {
  const { format }                = useFormatCurrency()
  const skin                      = getSkin(account.skinId)
  const [imgFailed, setImgFailed] = useState(false)

  // Decide what to show in the icon slot
  const showPhoto = skin.bgImage && !imgFailed
  const showLogo  = !showPhoto && skin.logoUrl

  return (
    <div
      className="wallet-tile"
      onClick={() => onOpen(account)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(account)}
      aria-label={`${account.name} — ${format(account.balance ?? 0)}`}
    >
      {/* Top row: icon thumbnail + action buttons */}
      <div className="wallet-tile__top">
        <div className="wallet-tile__icon">
          {showPhoto && (
            <img
              src={skin.bgImage}
              alt={skin.name}
              className="wallet-tile__photo"
              onError={() => setImgFailed(true)}
            />
          )}
          {showLogo && (
            <img
              src={skin.logoUrl}
              alt={skin.name}
              className="wallet-tile__logo"
              style={{ background: skin.colors.bg }}
              onError={() => setImgFailed(true)}
            />
          )}
          {!showPhoto && !showLogo && (
            <span
              className="wallet-tile__icon-fallback"
              style={{ background: skin.colors.bg }}
            >
              {account.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="wallet-tile__actions" onClick={(e) => e.stopPropagation()}>
          {/* Edit */}
          <button
            className="wallet-tile__action-btn"
            onClick={() => onEdit(account)}
            aria-label="Edit account"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 1.5l2.5 2.5L3.5 11H1v-2.5L8 1.5Z"/>
            </svg>
          </button>

          {/* Delete */}
          <button
            className="wallet-tile__action-btn wallet-tile__action-btn--danger"
            onClick={() => onDelete(account.id)}
            aria-label="Delete account"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1.5 3h9M4 3V2h4v1M4.5 5v3.5M7.5 5v3.5M2.5 3l.6 6.2a.8.8 0 0 0 .8.8h4.2a.8.8 0 0 0 .8-.8L9.5 3"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Balance */}
      <p className="wallet-tile__balance">{format(account.balance ?? 0)}</p>

      {/* Account name (single line, truncated) */}
      <p className="wallet-tile__name">{account.name}</p>
    </div>
  )
}
