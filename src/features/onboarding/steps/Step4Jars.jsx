import { useState } from 'react'
import { nanoid } from 'nanoid'
import { setDocument } from '@/firebase/firestore'

const JAR_PRESETS = [
  { name: 'Groceries',   type: 'open',   emoji: '🛒', target: 3000 },
  { name: 'Transport',   type: 'open',   emoji: '🚌', target: 1500 },
  { name: 'Eating out',  type: 'open',   emoji: '🍜', target: 2000 },
  { name: 'Load/WiFi',   type: 'lidded', emoji: '📶', target: 1000 },
  { name: 'Emergency',   type: 'lidded', emoji: '🚨', target: 5000 },
  { name: 'Self-care',   type: 'open',   emoji: '💆', target: 1000 },
]

/**
 * @param {{ data: object, onNext: Function, onBack: Function, uid: string }} props
 */
export default function Step4Jars({ data, onNext, onBack, uid }) {
  const [jars, setJars]     = useState(data.jars ?? [])
  const [saving, setSaving] = useState(false)

  function togglePreset(preset) {
    const exists = jars.find((j) => j.name === preset.name)
    if (exists) {
      setJars((prev) => prev.filter((j) => j.name !== preset.name))
    } else {
      setJars((prev) => [...prev, { ...preset, id: nanoid(), balance: 0 }])
    }
  }

  async function handleNext() {
    if (!uid || jars.length === 0) {
      onNext({ jars })
      return
    }
    setSaving(true)
    try {
      await Promise.all(
        jars.map((jar) =>
          setDocument(uid, 'jars', jar.id, {
            ...jar,
            createdAt: new Date().toISOString(),
          })
        )
      )
      onNext({ jars })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="animate-slide-up">
      <h2 className="onboarding-step__title">Set up your jars 🍯</h2>
      <p className="onboarding-step__subtitle">
        Pick a few spending categories to start. Lidded jars are for bills and savings. Open pots are for day-to-day spending.
      </p>

      <div className="option-grid">
        {JAR_PRESETS.map((preset) => {
          const selected = jars.some((j) => j.name === preset.name)
          return (
            <button
              key={preset.name}
              type="button"
              className={`option-pill${selected ? ' option-pill--selected' : ''}`}
              onClick={() => togglePreset(preset)}
            >
              <span className="option-pill__emoji">{preset.emoji}</span>
              <span>{preset.name}</span>
              <span style={{ fontSize: 'var(--text-xs)', opacity: 0.7 }}>
                {preset.type === 'lidded' ? '🪣' : '🫙'} ₱{preset.target.toLocaleString()}
              </span>
            </button>
          )
        })}
      </div>

      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-faint)', textAlign: 'center', marginTop: 'var(--space-3)' }}>
        You can add custom jars and edit targets from the Shelf room.
      </p>

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
