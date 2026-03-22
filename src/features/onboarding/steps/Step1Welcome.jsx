/**
 * @param {{ data: object, onNext: Function }} props
 */
export default function Step1Welcome({ data, onNext }) {
  return (
    <div className="animate-slide-up">
      <h1 className="onboarding-step__title">Hey, I'm Pokkie! 🐷</h1>
      <p className="onboarding-step__subtitle">
        I'll help you give every peso a job.<br />
        Let's get your Pokit set up in 2 minutes.
      </p>

      <div className="field">
        <label className="label" htmlFor="ob-name">What should I call you?</label>
        <input
          id="ob-name"
          className="input"
          type="text"
          placeholder="Your name"
          defaultValue={data.name}
          onBlur={(e) => {
            // Store name without advancing — user advances via button
            data.name = e.target.value
          }}
          autoFocus
        />
      </div>

      <div className="onboarding-step__actions">
        <button
          className="btn btn--primary btn--full"
          onClick={() => {
            const nameInput = document.getElementById('ob-name')
            onNext({ name: nameInput?.value?.trim() || 'Friend' })
          }}
        >
          Let's go →
        </button>
      </div>
    </div>
  )
}
