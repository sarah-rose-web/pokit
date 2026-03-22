import { useState }          from 'react'
import { getSkin }           from '@/config/cardSkins'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'

const TYPE_LABEL = {
  cash:    'Cash',
  bank:    'Bank',
  ewallet: 'E-Wallet',
  credit:  'Credit Card',
}

/**
 * Builds the inline style for .card-front.
 * Priority: real card photo → CSS color/gradient fallback.
 * @param {import('@/config/cardSkins').CardSkin} skin
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
  return {
    background: skin.colors.bg,
    color:      skin.colors.text ?? '#fff',
  }
}

/**
 * Landscape 3D-flip card for the vertical wallet stack.
 *
 * Interaction:
 *   1st tap  → focuses card (pops out of stack, reveals balance + card number)
 *   2nd tap  → flips 3D to show the back (bank name, transactions, edit/delete)
 *   tap outside → collapses (handled by parent)
 *
 * Front face only shows: account nickname (centred) + balance/number (bottom, on focus).
 * Bank name/logo lives on the back so the front stays clean over any card art.
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
  const { format }                  = useFormatCurrency()
  const skin                        = getSkin(account.skinId)
  const [imgFailed, setImgFailed]   = useState(false)

  const usingPhoto = skin.bgImage && !imgFailed
  const cardStyle  = usingPhoto
    ? buildCardStyle(skin)
    : { background: skin.colors.bg, color: skin.colors.text ?? '#fff' }

  // Stronger shadow when real card art is active
  const textShadow = usingPhoto
    ? '0 2px 8px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.6)'
    : '0 1px 4px rgba(0,0,0,0.5)'

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

          {/* Plastic sheen — z-index 3, border-radius: inherit */}
          <div className="card-front__sheen" />

          {/* Silent 404 detector — flips imgFailed if the card art file is missing */}
          {skin.bgImage && !imgFailed && (
            <img
              src={skin.bgImage}
              alt=""
              aria-hidden="true"
              style={{ display: 'none' }}
              onError={() => setImgFailed(true)}
            />
          )}

          {/* Account nickname — vertically centred in the card middle */}
          <div className="card-front__name" style={{ textShadow }}>
            {account.name}
          </div>

          {/* Balance + card number — pinned to bottom, fades in on focus
              Glassmorphism backdrop ensures legibility over any card art    */}
          <div className="card-front__details">
            <div className="card-front__balance" style={{ textShadow }}>
              {format(account.balance ?? 0)}
            </div>
            <div className="card-front__number-block">
              <div className="card-front__number" style={{ textShadow }}>
                {account.lastFour
                  ? `•••• •••• •••• ${account.lastFour}`
                  : '•••• •••• •••• ••••'}
              </div>
              <div className="card-front__type" style={{ textShadow }}>
                {TYPE_LABEL[account.type] ?? account.type}
              </div>
            </div>
          </div>

          <span className="card-front__flip-hint">tap again to flip ↺</span>
        </div>

        {/* ── BACK ── */}
        <div className="card-back" onClick={(e) => e.stopPropagation()}>
          <div className="card-back__header">
            {/* Bank name moved here so the front stays clean */}
            <div className="card-back__bank">
              {skin.logoUrl ? (
                <img
                  src={skin.logoUrl}
                  alt={skin.name}
                  className="card-back__bank-logo"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              ) : (
                <span className="card-back__bank-name">{skin.name}</span>
              )}
            </div>
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
