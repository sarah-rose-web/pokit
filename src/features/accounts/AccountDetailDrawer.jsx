import { useAuthStore }           from '@/store/authStore'
import { useAccountTransactions } from '@/hooks/useAccountTransactions'
import { useFormatCurrency }       from '@/hooks/useFormatCurrency'
import AccountCard                 from './AccountCard'

/**
 * Format ISO date string as "Mar 22" style.
 * @param {string} iso
 */
function fmtDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
}

/**
 * Simple expense icon based on note keywords.
 * @param {string} [note]
 */
function txnIcon(note = '') {
  const n = note.toLowerCase()
  if (n.includes('food') || n.includes('eat') || n.includes('resto')) return '🍜'
  if (n.includes('transport') || n.includes('grab') || n.includes('commute')) return '🚌'
  if (n.includes('shop') || n.includes('lazada') || n.includes('shopee')) return '🛍️'
  if (n.includes('bill') || n.includes('electric') || n.includes('internet')) return '💡'
  if (n.includes('health') || n.includes('meds') || n.includes('doctor')) return '💊'
  return '💸'
}

/**
 * @param {{
 *   account:  import('@/store/accountsStore').Account,
 *   onEdit:   (account: import('@/store/accountsStore').Account) => void,
 *   onDelete: (id: string) => void,
 *   onClose:  () => void,
 * }} props
 */
export default function AccountDetailDrawer({ account, onEdit, onDelete, onClose }) {
  const user = useAuthStore((s) => s.user)
  const { format } = useFormatCurrency()
  const { transactions, loading } = useAccountTransactions(user?.uid, account.id)

  // Close on backdrop click
  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="detail-backdrop" onClick={handleBackdrop}>
      <div
        className="detail-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={account.name}
      >
        {/* Drag handle */}
        <div className="detail-drawer__handle" />

        {/* Header */}
        <div className="detail-drawer__header">
          <button
            className="detail-drawer__action-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M10 6L6 10M6 6l4 4"/>
            </svg>
          </button>

          <span className="detail-drawer__title">{account.name}</span>

          <div className="detail-drawer__actions">
            <button
              className="detail-drawer__action-btn"
              onClick={() => { onClose(); onEdit(account) }}
              aria-label="Edit"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5Z"/>
              </svg>
            </button>
            <button
              className="detail-drawer__action-btn detail-drawer__action-btn--danger"
              onClick={() => { onClose(); onDelete(account.id) }}
              aria-label="Delete"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3.5h10M5 3.5V2.5h4v1M5.5 6v4M8.5 6v4M3 3.5l.7 7.2a1 1 0 0 0 1 .8h4.6a1 1 0 0 0 1-.8L11 3.5"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Card preview — read-only, no edit/delete buttons */}
        <div className="detail-drawer__card-wrap">
          {/* Render a static version of the card (no action buttons) */}
          <StaticCard account={account} />
        </div>

        {/* Scrollable body — two sections */}
        <div className="detail-drawer__scroll">

          {/* Section 1: Transaction History */}
          <p className="detail-drawer__section-title">Transaction History</p>

          {loading ? (
            <p className="detail-empty">Loading…</p>
          ) : transactions.length === 0 ? (
            <p className="detail-empty">No transactions yet.</p>
          ) : (
            transactions.map((txn) => (
              <div key={txn.id} className="txn-row">
                <div className="txn-row__icon">{txnIcon(txn.note)}</div>
                <div className="txn-row__body">
                  <div className="txn-row__note">{txn.note || 'Expense'}</div>
                  <div className="txn-row__date">{fmtDate(txn.createdAt)}</div>
                </div>
                <div className="txn-row__amount">−{format(txn.amount)}</div>
              </div>
            ))
          )}

          {/* Section 2: Savings */}
          <p className="detail-drawer__section-title" style={{ marginTop: 'var(--space-6)' }}>Savings</p>
          <p className="detail-empty">No savings goals linked to this account yet.</p>

        </div>
      </div>
    </div>
  )
}

/**
 * A read-only card face — same visual, no interactive buttons.
 * Duplicates the AccountCard markup minus the menu.
 */
import { getSkin } from '@/config/cardSkins'

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

/** @param {{ account: import('@/store/accountsStore').Account }} props */
function StaticCard({ account }) {
  const { format } = useFormatCurrency()
  const skin = getSkin(account.skinId)
  const showChip = account.type === 'bank' || account.type === 'credit'

  return (
    <div
      className="card-face"
      style={{ background: skin.colors.bg, color: skin.colors.text }}
    >
      <div className="card-face__overlay" />

      <div className="card-face__top">
        <div className="card-face__logo-area">
          <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{account.name}</span>
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
