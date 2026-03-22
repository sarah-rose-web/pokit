import { getSkin } from '@/config/cardSkins'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'

function Chip() {
  return (
    <svg className="card-face__chip" width="38" height="30" viewBox="0 0 38 30" fill="none">
      <rect x="1" y="1" width="36" height="28" rx="4" fill="#D4A84B" stroke="#B8902E" strokeWidth="1"/>
      <rect x="13" y="1" width="12" height="28" fill="#C49A35" opacity="0.5"/>
      <rect x="1" y="10" width="36" height="10" fill="#C49A35" opacity="0.5"/>
      <rect x="13" y="10" width="12" height="10" fill="#B8902E" opacity="0.6"/>
      <line x1="13" y1="1" x2="13" y2="29" stroke="#B8902E" strokeWidth="0.8"/>
      <line x1="25" y1="1" x2="25" y2="29" stroke="#B8902E" strokeWidth="0.8"/>
      <line x1="1" y1="10" x2="37" y2="10" stroke="#B8902E" strokeWidth="0.8"/>
      <line x1="1" y1="20" x2="37" y2="20" stroke="#B8902E" strokeWidth="0.8"/>
    </svg>
  )
}

function Contactless() {
  return (
    <svg className="card-face__nfc" width="18" height="20" viewBox="0 0 18 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M9 10c0-1.1.4-2 1.2-2.8" opacity="0.4"/>
      <path d="M9 10c0-2.2.8-4 2.4-5.6" opacity="0.65"/>
      <path d="M9 10c0-3.3 1.2-6 3.6-8.4" opacity="0.9"/>
    </svg>
  )
}

/**
 * @param {{
 *   account:  import('@/store/accountsStore').Account,
 *   onEdit:   (account: import('@/store/accountsStore').Account) => void,
 *   onDelete: (id: string) => void,
 * }} props
 */
/** Light-background skins need a dark logo instead of the default white filter */
const LIGHT_BG_SKINS = new Set([
  'generic-light', 'generic-gold',
])

export default function AccountCard({ account, onEdit, onDelete }) {
  const { format } = useFormatCurrency()
  const skin = getSkin(account.skinId)
  const showChip = account.type === 'bank' || account.type === 'credit'
  const logoClass = LIGHT_BG_SKINS.has(account.skinId)
    ? 'card-face__logo card-face__logo--dark'
    : 'card-face__logo'

  return (
    <div
      className="card-face"
      style={{ background: skin.colors.bg, color: skin.colors.text }}
      data-skin={account.skinId}
    >
      {/* Gloss overlay for depth */}
      <div className="card-face__overlay" />

      {/* Massive faded watermark — the big logo behind the card content */}
      {skin.logoUrl && (
        <img
          src={skin.logoUrl}
          alt=""
          className="card-face__watermark"
          aria-hidden="true"
        />
      )}

      <div className="card-face__top">
        <div className="card-face__logo-area">
          {skin.logoUrl
            ? <img
                src={skin.logoUrl}
                alt={skin.name}
                className={logoClass}
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            : null
          }
          <span className="card-face__bank-name" style={{ color: skin.colors.text }}>
            {account.name}
          </span>
        </div>
        <div className="card-face__menu">
          <button
            className="card-face__menu-btn"
            onClick={() => onEdit(account)}
            aria-label={`Edit ${account.name}`}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5Z"/>
            </svg>
          </button>
          <button
            className="card-face__menu-btn card-face__menu-btn--danger"
            onClick={() => onDelete(account.id)}
            aria-label={`Delete ${account.name}`}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3.5h10M5 3.5V2.5h4v1M5.5 6v4M8.5 6v4M3 3.5l.7 7.2a1 1 0 0 0 1 .8h4.6a1 1 0 0 0 1-.8L11 3.5"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="card-face__middle">
        {showChip && <Chip />}
        {showChip && <Contactless />}
      </div>

      <div className="card-face__bottom">
        <div className="card-face__bottom-left">
          <div className="card-face__number">
            {account.lastFour
              ? `•••• •••• •••• ${account.lastFour}`
              : `•••• •••• •••• ••••`}
          </div>
          <div className="card-face__type-label" style={{ color: skin.colors.text, opacity: 0.65 }}>
            {account.type.toUpperCase()}
          </div>
        </div>
        <div className="card-face__balance">
          {format(account.balance ?? 0)}
        </div>
      </div>
    </div>
  )
}
