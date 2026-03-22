import { useEffect, useState }  from 'react'
import { useAuthStore }          from '@/store/authStore'
import { useAccountsStore }      from '@/store/accountsStore'
import { useFormatCurrency }     from '@/hooks/useFormatCurrency'
import BottomNav                 from '@/components/BottomNav'
import AccountCard               from './AccountCard'
import AccountModal              from './AccountModal'
import AccountDetailDrawer       from './AccountDetailDrawer'
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

  const [filterType,     setFilterType]     = useState('all')
  const [selectedAccount, setSelectedAccount] = useState(null)  // account object | null
  const [modal,          setModal]          = useState(null)    // null | 'add' | account object
  const [saving,         setSaving]         = useState(false)
  const [confirmDelete,  setConfirmDelete]  = useState(null)    // account id

  useEffect(() => {
    if (user) subscribe(user.uid)
    return () => unsubscribe()
  }, [user])

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
      <main className="room page-enter">
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

        {/* Filter tabs */}
        {accounts.length > 0 && (
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
          <div className="accounts-stack">
            {visible.map((acc) => (
              <AccountCard
                key={acc.id}
                account={acc}
                onSelect={setSelectedAccount}
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

      {/* Detail drawer — opens when a card is tapped */}
      {selectedAccount && (
        <AccountDetailDrawer
          account={selectedAccount}
          onClose={() => setSelectedAccount(null)}
          onEdit={(a) => { setSelectedAccount(null); setModal(a) }}
          onDelete={(id) => { setSelectedAccount(null); setConfirmDelete(id) }}
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
