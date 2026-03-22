import { useState }         from 'react'
import { getSkin }          from '@/config/cardSkins'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'

const TYPE_LABEL = {
  cash:    'Cash',
  bank:    'Bank',
  ewallet: 'E-Wallet',
  credit:  'Credit Card',
}

/**
 * Builds the inline style for the card-front div.
 * Priority: real card photo → CSS color/gradient fallback.
 * When bgImage is set but the file doesn't exist yet, onError swaps to the
 * CSS fallback automatically — no code change needed when you add a photo later.
 *
 * @param {import('@/config/cardSkins').CardSkin} skin
 * @returns {{ backgroundImage: string, backgroundColor: string, backgroundSize: string, ... }}
 */
function buildCardStyle(skin) {
  if (skin.bgImage) {
    return {
      backgroundImage:    `url(${skin.bgImage})`,
      backgroundColor:    skin.colors.bg.startsWith('linear') ? 'transparent' : skin.colors.bg,
      backgroundSize:     'cover',
      backgroundPosition: 'center',
      backgroundRepeat:   'no-repeat',
      color:              skin.colors.text ?? '#fff',
    }
  }
  // CSS-only (generic cards + any named card missing its photo)
  return {
    background: skin.colors.bg,
    color:      skin.colors.text ?? '#fff',
  }
}

/**
 * Portrait 3D-flip card for the horizontal wallet carousel.
 *
 * Interaction:
 *   1st tap → focuses card (slides out, fades in balance + last-4)
 *   2nd tap → flips 3D to show transaction back with Edit / Delete
 *   tap outside (from parent) → collapses
 *
 * Card art: if `/public/card-art/{skinId}.png` exists it is used as the full
 * card background. Otherwise the skin's CSS color/gradient is the fallback.
 * The bank logo and watermark are intentionally omitted because the real card
 * photo already contains them.
 *
 * @param {{
 *   account:   import('@/store/accountsStore').Account,
 *   isFocused: boolean,
 *   isFlipped: boolean,
 *   onClick:   (id: string) => void,
 *   onEdit:    (account: import('@/store/accountsStore').Account) => void,
 *   onDelete:  (id: string) => void,
 * }} props
 */
export default function AccountCard({ account, isFocused, isFlipped, onClick, onEdit, onDelete }) {
  const { format }       = useFormatCurrency()
  const skin             = getSkin(account.skinId)
  const [imgFailed, setImgFailed] = useState(false)

  // If the card-art image 404s, fall back to CSS immediately
  const cardStyle = (skin.bgImage && !imgFailed)
    ? buildCardStyle(skin)
    : { background: skin.colors.bg, color: skin.colors.text ?? '#fff' }

  // When the real card photo is in use, text needs a stronger shadow for legibility
  const textShadow = (skin.bgImage && !imgFailed)
    ? '0 1px 6px rgba(0,0,0,0.7), 0 2px 12px rgba(0,0,0,0.5)'
    : '0 1px 3px rgba(0,0,0,0.4)'

  return (
    <div
      className={`card-scene${isFocused ? ' focused' : ''}${isFlipped ? ' flipped' : ''}`}
      onClick={() => onClick(account.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(account.id)}
      aria-label={`${account.name} — ${format(account.balance ?? 0)}`}
    >
      <div className="card-flipper">

        {/* ── FRONT ── */}
        <div className="card-front" style={cardStyle}>

          {/* Subtle sheen — softens harsh card photos, keeps the premium feel */}
          <div className="card-front__sheen" />

          {/*
           * Hidden <img> trick: lets the browser attempt to load the card art.
           * If it fails, we flip `imgFailed` → component re-renders with CSS fallback.
           * This means you never see a broken-image icon.
           */}
          {skin.bgImage && !imgFailed && (
            <img
              src={skin.bgImage}
              alt=""
              aria-hidden="true"
              style={{ display: 'none' }}
              onError={() => setImgFailed(true)}
            />
          )}

          {/* Top: account nickname (bank logo is on the photo itself) */}
          <div className="card-front__top" style={{ textShadow }}>
            {/* When no real card art: show the bank name as text */}
            {(!skin.bgImage || imgFailed) && (
              skin.logoUrl ? (
                <img
                  src={skin.logoUrl}
                  alt={skin.name}
                  className="card-front__logo"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              ) : (
                <span className="card-front__bank-name">{skin.name}</span>
              )
            )}
          </div>

          {/* Middle: account nickname */}
          <div className="card-front__name" style={{ textShadow }}>
            {account.name}
          </div>

          {/* Bottom details — fade in on focus */}
          <div className="card-front__details">
            <div className="card-front__balance" style={{ textShadow }}>
              {format(account.balance ?? 0)}
            </div>
            <div className="card-front__number" style={{ textShadow }}>
              {account.lastFour
                ? `•••• •••• •••• ${account.lastFour}`
                : '•••• •••• •••• ••••'}
            </div>
            <div className="card-front__type" style={{ textShadow }}>
              {TYPE_LABEL[account.type] ?? account.type}
            </div>
          </div>

          <span className="card-front__flip-hint">tap again to flip ↺</span>
        </div>

        {/* ── BACK ── */}
        <div className="card-back" onClick={(e) => e.stopPropagation()}>
          <div className="card-back__header">
            <span>Transactions</span>
            <div className="card-back__actions">
              <button
                className="card-back__btn card-back__btn--edit"
                onClick={(e) => { e.stopPropagation(); onEdit(account) }}
              >
                Edit
              </button>
              <button
                className="card-back__btn card-back__btn--delete"
                onClick={(e) => { e.stopPropagation(); onDelete(account.id) }}
              >
                Delete
              </button>
            </div>
          </div>

          <div className="card-back__tx-list">
            <p className="card-back__empty">No recent transactions yet.</p>
          </div>
        </div>

      </div>
    </div>
  )
}
