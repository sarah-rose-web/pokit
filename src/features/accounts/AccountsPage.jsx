import { useEffect, useState }  from 'react'
import { useAuthStore }          from '@/store/authStore'
import { useAccountsStore }      from '@/store/accountsStore'
import { useFormatCurrency }     from '@/hooks/useFormatCurrency'
import BottomNav    from '@/components/BottomNav'
import AccountCard  from './AccountCard'
import AccountModal from './AccountModal'
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
  const [viewMode,      setViewMode]      = useState('stack') // 'stack' | 'grid'
  const [expandedId,    setExpandedId]    = useState(null)    // which card is expanded inline
  const [modal,         setModal]         = useState(null)    // null | 'add' | account object
  const [saving,        setSaving]        = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)    // account id

  useEffect(() => {
    if (user) subscribe(user.uid)
    return () => unsubscribe()
  }, [user])

  // Collapse any expanded card when filter or view changes
  useEffect(() => { setExpandedId(null) }, [filterType, viewMode])

  // Net worth
  const assets = accounts
    .filter((a) => a.type !== 'credit')
    .reduce((sum, a) => sum + (a.balance ?? 0), 0)

  const creditDebt = accounts
    .filter((a) => a.type === 'credit')
    .reduce((sum, a) => sum + (a.balance ?? 0), 0)

  const netWorth = assets - creditDebt

  // Filtered list
  const visible = filterType === 'all'
    ? accounts
    : accounts.filter((a) => a.type === filterType)

  /** Toggle inline expansion. Clicking the already-expanded card collapses it. */
  function handleCardSelect(account) {
    setExpandedId((prev) => prev === account.id ? null : account.id)
  }

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

  return (
    <>
      <main className="room page-enter" onClick={() => setExpandedId(null)}>
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

        {/* Filter tabs + view toggle */}
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
              <button
                className={`view-btn${viewMode === 'stack' ? ' view-btn--active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setViewMode('stack') }}
                title="Wallet stack"
              >
                {/* stacked lines icon */}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <rect x="1" y="1" width="12" height="3.5" rx="1"/>
                  <rect x="1" y="5.5" width="12" height="3.5" rx="1" opacity="0.6"/>
                  <rect x="1" y="10" width="12" height="3" rx="1" opacity="0.35"/>
                </svg>
              </button>
              <button
                className={`view-btn${viewMode === 'grid' ? ' view-btn--active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setViewMode('grid') }}
                title="List view"
              >
                {/* list icon */}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <rect x="1" y="1"   width="12" height="3.5" rx="1"/>
                  <rect x="1" y="5.5" width="12" height="3.5" rx="1"/>
                  <rect x="1" y="10"  width="12" height="3"   rx="1"/>
                </svg>
              </button>
            </div>
          </>
        )}

        {/* Wallet stack */}
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
        ) : (
          <div
            className={viewMode === 'stack' ? 'accounts-stack' : 'accounts-grid'}
            onClick={(e) => e.stopPropagation()}
          >
            {visible.map((acc) => (
              <AccountCard
                key={acc.id}
                account={acc}
                isExpanded={expandedId === acc.id}
                onSelect={handleCardSelect}
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
