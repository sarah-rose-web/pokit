import { useState } from 'react'
import { GATEWAY_FEES } from '@/services/currencyEngine'

const CURRENCIES = [
  { value: 'PHP', emoji: '🇵🇭', label: 'PHP' },
  { value: 'USD', emoji: '🇺🇸', label: 'USD' },
  { value: 'AUD', emoji: '🇦🇺', label: 'AUD' },
  { value: 'GBP', emoji: '🇬🇧', label: 'GBP' },
  { value: 'CAD', emoji: '🇨🇦', label: 'CAD' },
  { value: 'EUR', emoji: '🇪🇺', label: 'EUR' },
]

/**
 * @param {{ data: object, onNext: Function, onBack: Function }} props
 */
export default function Step2Currency({ data, onNext, onBack }) {
  const [currency, setCurrency] = useState(data.currency ?? 'PHP')
  const [gateway, setGateway]   = useState(data.gateway ?? 'gcash')

  const gatewayList = Object.entries(GATEWAY_FEES).map(([value, { label }]) => ({
    value, label,
  }))

  return (
    <div className="animate-slide-up">
      <h2 className="onboarding-step__title">How do you get paid?</h2>
      <p className="onboarding-step__subtitle">
        Pokit will automatically deduct fees and convert to ₱.
      </p>

      <p className="label" style={{ marginBottom: 'var(--space-3)' }}>Income currency</p>
      <div className="option-grid">
        {CURRENCIES.map((c) => (
          <button
            key={c.value}
            type="button"
            className={`option-pill${currency === c.value ? ' option-pill--selected' : ''}`}
            onClick={() => setCurrency(c.value)}
          >
            <span className="option-pill__emoji">{c.emoji}</span>
            {c.label}
          </button>
        ))}
      </div>

      <p className="label" style={{ margin: 'var(--space-4) 0 var(--space-3)' }}>Payment gateway</p>
      <div className="option-grid">
        {gatewayList.map((g) => (
          <button
            key={g.value}
            type="button"
            className={`option-pill${gateway === g.value ? ' option-pill--selected' : ''}`}
            onClick={() => setGateway(g.value)}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="onboarding-step__actions">
        <button className="btn btn--ghost" onClick={onBack}>← Back</button>
        <button
          className="btn btn--primary"
          style={{ flex: 1 }}
          onClick={() => onNext({ currency, gateway })}
        >
          Next →
        </button>
      </div>
    </div>
  )
}
