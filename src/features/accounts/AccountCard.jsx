import { getSkin }          from '@/config/cardSkins'
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

const LIGHT_BG_SKINS = new Set(['generic-light', 'generic-gold'])

/**
 * Card in the wallet stack or grid.
 * - Stack hover: CSS translateY(-8px) — works cleanly with uniform z-index
 * - Click: toggles `expanded` class (passed from parent as isExpanded)
 * - Expanded: card pops to front, transactions panel slides in below card content
 *
 * @param {{
 *   account:    import('@/store/accountsStore').Account,
 *   isExpanded: boolean,
 *   onSelect:   (account: import('@/store/accountsStore').Account) => void,
 *   onEdit:     (account: import('@/store/accountsStore').Account) => void,
 *   onDelete:   (id: string) => void,
 * }} props
 */
export default function AccountCard({ account, isExpanded, onSelect, onEdit, onDelete }) {
  const { format } = useFormatCurrency()
  const skin       = getSkin(account.skinId)
  const showChip   = account.type === 'bank' || account.type === 'credit'
  const logoClass  = LIGHT_BG_SKINS.has(account.skinId)
    ? 'card-face__logo card-face__logo--dark'
    : 'card-face__logo'

  return (
    <div
      className={`card-face${isExpanded ? ' expanded' : ''}`}
      style={{ background: skin.colors.bg, color: skin.colors.text }}
      data-skin={account.skinId}
      onClick={() => onSelect(account)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(account)}
      aria-label={`${account.name} — ${format(account.balance ?? 0)}`}
      aria-expanded={isExpanded}
    >
      {/* Plastic sheen */}
      <div className="card-face__overlay" />

      {/* Watermark */}
      {skin.logoUrl && (
        <img src={skin.logoUrl} alt="" className="card-face__watermark" aria-hidden="true" />
      )}

      {/* ── Top: logo OR skin name ── */}
      <div className="card-face__top">
        <div className="card-face__logo-area">
          {skin.logoUrl ? (
            <img
              src={skin.logoUrl}
              alt={skin.name}
              className={logoClass}
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          ) : (
            <span className="card-face__bank-name" style={{ color: skin.colors.text }}>
              {skin.name}
            </span>
          )}
        </div>
      </div>

      {/* ── Middle: EMV chip + NFC ── */}
      <div className="card-face__middle">
        {showChip && <Chip />}
        {showChip && <Contactless />}
      </div>

      {/* ── Bottom: number | cardholder | type  /  balance ── */}
      <div className="card-face__bottom">
        <div className="card-face__bottom-left">
          <div className="card-face__number">
            {account.lastFour
              ? `•••• •••• •••• ${account.lastFour}`
              : `•••• •••• •••• ••••`}
          </div>
          <div className="card-face__cardholder" style={{ color: skin.colors.text }}>
            {account.name}
          </div>
          <div className="card-face__type-label" style={{ color: skin.colors.text }}>
            {account.type.toUpperCase()}
          </div>
        </div>
        <div className="card-face__balance">
          {format(account.balance ?? 0)}
        </div>
      </div>

      {/* ── Inline transactions panel — shown when expanded ── */}
      <div className="card-transactions" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', textShadow: 'none' }}>
            Recent Transactions
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '6px', padding: '4px 10px', color: '#fff', fontSize: '11px', cursor: 'pointer' }}
              onClick={(e) => { e.stopPropagation(); onEdit(account) }}
            >
              Edit
            </button>
            <button
              style={{ background: 'rgba(229,62,62,0.3)', border: 'none', borderRadius: '6px', padding: '4px 10px', color: '#fff', fontSize: '11px', cursor: 'pointer' }}
              onClick={(e) => { e.stopPropagation(); onDelete(account.id) }}
            >
              Delete
            </button>
          </div>
        </div>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textShadow: 'none' }}>
          No recent transactions yet.
        </p>
      </div>
    </div>
  )
}
