import { useState } from 'react'
import { nanoid } from 'nanoid'
import { setDocument } from '@/firebase/firestore'

const ACCOUNT_TYPES = [
  { value: 'cash',    emoji: '💵', label: 'Cash' },
  { value: 'bank',    emoji: '🏦', label: 'Bank' },
  { value: 'ewallet', emoji: '📱', label: 'E-wallet' },
  { value: 'credit',  emoji: '💳', label: 'Credit card' },
]

const PRESETS = [
  { name: 'BDO',    type: 'bank',    emoji: '🏦' },
  { name: 'BPI',    type: 'bank',    emoji: '🏦' },
  { name: 'GCash',  type: 'ewallet', emoji: '📱' },
  { name: 'Maya',   type: 'ewallet', emoji: '📱' },
  { name: 'Cash',   type: 'cash',    emoji: '💵' },
]

/**
 * @param {{ data: object, onNext: Function, onBack: Function, uid: string }} props
 */
export default function Step3Accounts({ data, onNext, onBack, uid }) {
  const [accounts, setAccounts] = useState(data.accounts ?? [])
  const [name, setName]         = useState('')
  const [type, setType]         = useState('bank')
  const [balance, setBalance]   = useState('')
  const [saving, setSaving]     = useState(false)

  function addPreset(preset) {
    const exists = accounts.find((a) => a.name === preset.name)
    if (exists) return
    setAccounts((prev) => [...prev, { ...preset, id: nanoid(), balance: 0 }])
  }

  function addCustom() {
    if (!name.trim()) return
    setAccounts((prev) => [
      ...prev,
      { id: nanoid(), name: name.trim(), type, balance: parseFloat(balance) || 0 },
    ])
    setName('')
    setBalance('')
  }

  function remove(id) {
    setAccounts((prev) => prev.filter((a) => a.id !== id))
  }

  async function handleNext() {
    if (!uid || accounts.length === 0) {
      onNext({ accounts })
      return
    }
    setSaving(true)
    try {
      await Promise.all(
        accounts.map((acc) =>
          setDocument(uid, 'accounts', acc.id, {
            ...acc,
            createdAt: new Date().toISOString(),
          })
        )
      )
      onNext({ accounts })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="animate-slide-up">
      <h2 className="onboarding-step__title">Your accounts</h2>
      <p className="onboarding-step__subtitle">
        Add where your money lives. You can always add more later.
      </p>

      {/* Quick presets */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        {PRESETS.map((p) => (
          <button
            key={p.name}
            type="button"
            className="pill pill--muted"
            style={{ cursor: 'pointer', fontSize: 'var(--text-sm)', padding: 'var(--space-2) var(--space-3)' }}
            onClick={() => addPreset(p)}
          >
            {p.emoji} + {p.name}
          </button>
        ))}
      </div>

      {/* Existing accounts */}
      {accounts.length > 0 && (
        <div className="onboarding-list">
          {accounts.map((acc) => (
            <div key={acc.id} className="onboarding-list-item">
              <span>{acc.type === 'cash' ? '💵' : acc.type === 'ewallet' ? '📱' : acc.type === 'credit' ? '💳' : '🏦'}</span>
              <span className="onboarding-list-item__name">{acc.name}</span>
              <span className="onboarding-list-item__meta">₱{(acc.balance ?? 0).toLocaleString()}</span>
              <button
                className="btn btn--icon btn--ghost"
                style={{ fontSize: 'var(--text-xs)', width: 28, height: 28 }}
                onClick={() => remove(acc.id)}
                aria-label={`Remove ${acc.name}`}
              >✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Custom add */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
        <input
          className="input"
          placeholder="Account name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ flex: 2 }}
        />
        <input
          className="input"
          placeholder="₱ Balance"
          type="number"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        {ACCOUNT_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            className={`option-pill${type === t.value ? ' option-pill--selected' : ''}`}
            style={{ flex: 1, padding: 'var(--space-2)' }}
            onClick={() => setType(t.value)}
          >
            {t.emoji}
          </button>
        ))}
      </div>
      <button className="onboarding-add-btn" onClick={addCustom} disabled={!name.trim()}>
        + Add account
      </button>

      <div className="onboarding-step__actions">
        <button className="btn btn--ghost" onClick={onBack}>← Back</button>
        <button
          className="btn btn--primary"
          style={{ flex: 1 }}
          onClick={handleNext}
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Next →'}
        </button>
      </div>
    </div>
  )
}
