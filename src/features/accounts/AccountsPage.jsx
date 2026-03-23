import { useEffect, useState }  from 'react'
import { useAuthStore }          from '@/store/authStore'
import { useAccountsStore }      from '@/store/accountsStore'
import { useFormatCurrency }     from '@/hooks/useFormatCurrency'
import BottomNav             from '@/components/BottomNav'
import AccountCard           from './AccountCard'
import WalletTile            from './WalletTile'
import AccountDetailDrawer   from './AccountDetailDrawer'
import AccountModal          from './AccountModal'
import './accounts.css'

const FILTERS = [
  { id: 'all',     label: 'All' },
  { id: 'bank',    label: 'Bank' },
  { id: 'ewallet', label: 'E-Wallet' },
  { id: 'credit',  label: 'Credit' },
  { id: 'cash',    label: 'Cash' },
]

export default function AccountsPage() {
  const user = useAuthStore((s) => s.user)
  const { accounts, loading, subscribe, unsubscribe, addAccount, updateAccount, deleteAccount } =
    useAccountsStore()
  const { format } = useFormatCurrency()

  const [filterType,    setFilterType]    = useState('all')
  const [viewMode,      setViewMode]      = useState('wallet') // 'wallet' | 'tile'
  const [focusedId,     setFocusedId]     = useState(null)     // wallet: focused card
  const [flippedId,     setFlippedId]     = useState(null)     // wallet: flipped card
  const [detailAccount, setDetailAccount] = useState(null)     // tile: drawer target
  const [modal,         setModal]         = useState(null)     // null | 'add' | account
  const [saving,        setSaving]        = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)     // account id

  useEffect(() => {
    if (user) subscribe(user.uid)
    return () => unsubscribe()
  }, [user])

  // Reset all interaction state when filter or view changes
  useEffect(() => {
    setFocusedId(null)
    setFlippedId(null)
    setDetailAccount(null)
  }, [filterType, viewMode])

  /** Wallet view: 1st tap focuses, 2nd tap flips */
  function handleCardClick(id) {
    if (focusedId !== id) {
      setFocusedId(id)
      setFlippedId(null)
    } else {
      setFlippedId((prev) => prev === id ? null : id)
    }
  }

  // Net worth
  const assets = accounts
    .filter((a) => a.type !== 'credit')
    .reduce((sum, a) => sum + (a.balance ?? 0), 0)

  const creditDebt = accounts
    .filter((a) => a.type === 'credit')
    .reduce((sum, a) => sum + (a.balance ?? 0), 0)

  const netWorth = assets - creditDebt

  const visible = filterType === 'all'
    ? accounts
    : accounts.filter((a) => a.type === filterType)

  async function handleSave(data) {
    if (!user) return
    setSaving(true)
    try {
      if (modal && typeof modal === 'object') {
        await updateAccount(user.uid, modal.id, data)
      } else {
        await addAccount(user.uid, data)
      }
      setModal(null)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!user) return
    await deleteAccount(user.uid, id)
    setConfirmDelete(null)
  }

  function collapseAll() {
    setFocusedId(null)
    setFlippedId(null)
  }

  return (
    <>
      <main
        className="room room--bedroom page-enter"
        onClick={collapseAll}
      >
        <h1 className="room__title">Bedroom</h1>

        {/* Net worth jewelry box */}
        <div className="jewelry-box">
          <p className="jewelry-box__label">Net worth</p>
          <p className="jewelry-box__amount">{format(netWorth)}</p>
          <div className="jewelry-box__breakdown">
            <span>Assets {format(assets)}</span>
            {creditDebt > 0 && <span>Credit −{format(creditDebt)}</span>}
          </div>
        </div>

        {/* Filter pills + view toggle */}
        {accounts.length > 0 && (
          <>
            <div className="accounts-filters">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  className={`filter-pill${filterType === f.id ? ' filter-pill--active' : ''}`}
                  onClick={() => setFilterType(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="view-toggle">
              {/* Wallet (stack) view */}
              <button
                className={`view-btn${viewMode === 'wallet' ? ' view-btn--active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setViewMode('wallet') }}
                title="Wallet stack"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <rect x="1" y="1"   width="12" height="3.5" rx="1"/>
                  <rect x="1" y="5.5" width="12" height="3.5" rx="1" opacity="0.6"/>
                  <rect x="1" y="10"  width="12" height="3"   rx="1" opacity="0.35"/>
                </svg>
              </button>

              {/* Tile view */}
              <button
                className={`view-btn${viewMode === 'tile' ? ' view-btn--active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setViewMode('tile') }}
                title="Tile view"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <rect x="1" y="1" width="5" height="5" rx="1"/>
                  <rect x="8" y="1" width="5" height="5" rx="1"/>
                  <rect x="1" y="8" width="5" height="5" rx="1"/>
                  <rect x="8" y="8" width="5" height="5" rx="1"/>
                </svg>
              </button>
            </div>
          </>
        )}

        {/* Card list */}
        {loading ? (
          <div className="room__empty">Loading…</div>
        ) : visible.length === 0 && accounts.length === 0 ? (
          <div className="room__empty">
            <p>No accounts yet.</p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
              Add where your money lives.
            </p>
          </div>
        ) : visible.length === 0 ? (
          <div className="room__empty" style={{ paddingTop: 'var(--space-6)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
              No {filterType} accounts.
            </p>
          </div>
        ) : viewMode === 'wallet' ? (
          <div className="accounts-stack" onClick={(e) => e.stopPropagation()}>
            {visible.map((acc) => (
              <AccountCard
                key={acc.id}
                account={acc}
                isFocused={focusedId === acc.id}
                isFlipped={flippedId === acc.id}
                onClick={handleCardClick}
                onEdit={(a) => setModal(a)}
                onDelete={(id) => setConfirmDelete(id)}
              />
            ))}
          </div>
        ) : (
          <div className="accounts-tiles" onClick={(e) => e.stopPropagation()}>
            {visible.map((acc) => (
              <WalletTile
                key={acc.id}
                account={acc}
                onOpen={(a) => setDetailAccount(a)}
                onEdit={(a) => setModal(a)}
                onDelete={(id) => setConfirmDelete(id)}
              />
            ))}
          </div>
        )}

        {/* FAB */}
        <button className="fab" onClick={() => setModal('add')} aria-label="Add account">
          +
        </button>
      </main>

      <BottomNav />

      {/* Tile detail drawer */}
      {detailAccount && (
        <AccountDetailDrawer
          account={detailAccount}
          onEdit={(a) => { setDetailAccount(null); setModal(a) }}
          onDelete={(id) => { setDetailAccount(null); setConfirmDelete(id) }}
          onClose={() => setDetailAccount(null)}
        />
      )}

      {/* Add / Edit modal */}
      {modal !== null && (
        <AccountModal
          account={typeof modal === 'object' ? modal : null}
          onSave={handleSave}
          onClose={() => setModal(null)}
          saving={saving}
        />
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal modal--compact" onClick={(e) => e.stopPropagation()}>
            <p style={{ marginBottom: 'var(--space-4)', fontWeight: 'var(--weight-medium)' }}>
              Delete this account?
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-5)' }}>
              This can't be undone.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button className="btn btn--ghost" style={{ flex: 1 }} onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
              <button className="btn btn--danger" style={{ flex: 1 }} onClick={() => handleDelete(confirmDelete)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
