import { useState, useEffect } from 'react'
import BankSelectorDropdown from './BankSelectorDropdown'

const ACCOUNT_TYPES = [
  { value: 'cash',    label: 'Cash' },
  { value: 'bank',    label: 'Bank' },
  { value: 'ewallet', label: 'E-wallet' },
  { value: 'credit',  label: 'Credit' },
]

/**
 * @param {{
 *   account:  import('@/store/accountsStore').Account | null,
 *   onSave:   (data: object) => void,
 *   onClose:  () => void,
 *   saving:   boolean,
 * }} props
 */
export default function AccountModal({ account, onSave, onClose, saving }) {
  const isEdit = !!account

  const [name,     setName]     = useState(account?.name     ?? '')
  const [type,     setType]     = useState(account?.type     ?? 'bank')
  const [balance,  setBalance]  = useState(account?.balance  ?? '')
  const [lastFour, setLastFour] = useState(account?.lastFour ?? '')
  const [skinId,   setSkinId]   = useState(account?.skinId   ?? null)

  useEffect(() => {
    if (account) {
      setName(account.name ?? '')
      setType(account.type ?? 'bank')
      setBalance(account.balance ?? '')
      setLastFour(account.lastFour ?? '')
      setSkinId(account.skinId ?? null)
    }
  }, [account])

  /** Called when user picks a bank — sets skin, auto-fills name, and snaps the type */
  function handleBankSelect(id, bankName, baseType) {
    setSkinId(id)
    setName(bankName)
    if (baseType) setType(baseType)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    onSave({
      name:     name.trim(),
      type,
      balance:  parseFloat(balance) || 0,
      lastFour: lastFour.trim() || null,
      skinId,
    })
  }

  const showLastFour = type === 'credit' || type === 'bank'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">{isEdit ? 'Edit account' : 'Add account'}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal__body">

          {/* Bank selector — sets skinId + auto-fills name */}
          <div className="field">
            <span className="field__label">Bank / Wallet</span>
            <BankSelectorDropdown skinId={skinId} onSelect={handleBankSelect} />
          </div>

          {/* Name — editable after auto-fill */}
          <label className="field">
            <span className="field__label">
              Account name <span className="field__optional">(auto-filled, tap to edit)</span>
            </span>
            <input
              className="input"
              placeholder="e.g. BDO Savings"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span className="field__label">Type</span>
            <div className="option-grid">
              {ACCOUNT_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  className={`option-pill${type === t.value ? ' option-pill--selected' : ''}`}
                  onClick={() => setType(t.value)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </label>

          <label className="field">
            <span className="field__label">Current balance</span>
            <input
              className="input"
              type="number"
              placeholder="0.00"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              min="0"
              step="0.01"
            />
          </label>

          {showLastFour && (
            <label className="field">
              <span className="field__label">
                Last 4 digits <span className="field__optional">(optional)</span>
              </span>
              <input
                className="input"
                placeholder="1234"
                value={lastFour}
                onChange={(e) => setLastFour(e.target.value.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
                inputMode="numeric"
              />
            </label>
          )}

          <button
            type="submit"
            className="btn btn--primary"
            style={{ width: '100%', marginTop: 'var(--space-2)' }}
            disabled={saving || !name.trim()}
          >
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add account'}
          </button>
        </form>
      </div>
    </div>
  )
}
