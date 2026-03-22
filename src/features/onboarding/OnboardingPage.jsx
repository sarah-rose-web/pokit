import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store'
import Pokkie from '@/components/Pokkie'
import Step1Welcome   from './steps/Step1Welcome'
import Step2Currency  from './steps/Step2Currency'
import Step3Accounts  from './steps/Step3Accounts'
import Step4Jars      from './steps/Step4Jars'
import Step5Done      from './steps/Step5Done'
import './onboarding.css'

const TOTAL_STEPS = 5

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuthStore()

  const [step, setStep] = useState(1)
  const [data, setData] = useState({
    name:     '',
    currency: 'PHP',
    gateway:  'gcash',
    accounts: [],
    jars:     [],
  })

  function next(partial = {}) {
    setData((prev) => ({ ...prev, ...partial }))
    if (step < TOTAL_STEPS) setStep((s) => s + 1)
  }

  function back() {
    if (step > 1) setStep((s) => s - 1)
  }

  async function finish(partial = {}) {
    const final = { ...data, ...partial }
    await updateProfile({
      name:           final.name,
      currency:       final.currency,
      gateway:        final.gateway,
      onboardingDone: true,
    })
    navigate('/')
  }

  const pokkieExp = step === 5 ? 'happy' : step === 1 ? 'neutral' : 'thinking'

  return (
    <div className="onboarding-page page-enter">

      <div className="onboarding-progress">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`onboarding-progress__dot${i + 1 <= step ? ' onboarding-progress__dot--active' : ''}`}
          />
        ))}
      </div>

      <div className="onboarding-pokkie">
        <Pokkie size={72} expression={pokkieExp} className="animate-float" />
      </div>

      <div className="onboarding-content stagger-children">
        {step === 1 && <Step1Welcome  data={data} onNext={next} />}
        {step === 2 && <Step2Currency data={data} onNext={next} onBack={back} />}
        {step === 3 && <Step3Accounts data={data} onNext={next} onBack={back} uid={user?.uid} />}
        {step === 4 && <Step4Jars     data={data} onNext={next} onBack={back} uid={user?.uid} />}
        {step === 5 && <Step5Done     data={data} onFinish={finish} />}
      </div>

    </div>
  )
}
