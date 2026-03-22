import { useState } from 'react'

/**
 * @param {{ data: object, onFinish: Function }} props
 */
export default function Step5Done({ data, onFinish }) {
  const [loading, setLoading] = useState(false)

  async function handleFinish() {
    setLoading(true)
    await onFinish()
  }

  return (
    <div className="animate-pop-in" style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 40, marginBottom: 'var(--space-4)' }}>🎉</p>

      <h2 className="onboarding-step__title">
        You're all set{data.name ? `, ${data.name}` : ''}!
      </h2>

      <p className="onboarding-step__subtitle">
        Your Pokit is ready. Every peso is about to have a job.
        Head to the Kitchen to log your first paycheck.
      </p>

      <div style={{
        background: 'var(--primary-100)',
        border: '1px solid var(--primary-light)',
        borderRadius: 'var(--radius)',
        padding: 'var(--space-4)',
        marginBottom: 'var(--space-6)',
        fontSize: 'var(--text-sm)',
        color: 'var(--primary-dark)',
        textAlign: 'left',
      }}>
        <strong>Quick tip:</strong> Tap the 🍳 Kitchen tab and enter your next paycheck.
        Pokkie will split it for you automatically.
      </div>

      <button
        className="btn btn--primary btn--full"
        onClick={handleFinish}
        disabled={loading}
      >
        {loading ? 'Opening your Pokit…' : 'Go to my Pokit →'}
      </button>
    </div>
  )
}
