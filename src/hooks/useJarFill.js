import { useEffect, useRef } from 'react'

/**
 * Animates a jar fill element to a target percentage.
 * Sets --fill-target CSS custom property and triggers the jar-fill-animate class.
 *
 * Usage:
 *   const fillRef = useJarFill(jar.balance / jar.target)
 *   <div ref={fillRef} className="honey-jar__fill" />
 *
 * @param {number} fillRatio  — 0 to 1
 * @returns {React.RefObject<HTMLElement>}
 */
export function useJarFill(fillRatio) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const clampedPercent = Math.min(100, Math.max(0, Math.round(fillRatio * 100)))

    // Remove class first so re-adding it re-triggers the animation
    el.classList.remove('jar-fill-animate')

    // RAF ensures the class removal is painted before re-adding
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.setProperty('--fill-target', `${clampedPercent}%`)
        el.style.height = `${clampedPercent}%`
        el.classList.add('jar-fill-animate')
      })
    })
  }, [fillRatio])

  return ref
}
