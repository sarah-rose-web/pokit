import { useMemo } from 'react'
import { useExpensesStore, useJarsStore, useAccountsStore } from '@/store'
import { computeVelocity, safeToSpend, daysUntilPayday as calcDaysUntilPayday } from '@/services/velocityEngine'

/**
 * Computes spending velocity and safe-to-spend amount reactively.
 * @param {{ nextPayday: string, windowDays?: number }} params
 * @returns {{
 *   dailyBurnRate:    number,
 *   weeklyBurnRate:   number,
 *   monthlyBurnRate:  number,
 *   daysUntilEmpty:   number,
 *   daysUntilPayday:  number,
 *   safeToSpendToday: number,
 *   byJar:            Record<string, import('@/services/velocityEngine').JarVelocity>,
 * }}
 */
export function useVelocity({ nextPayday, windowDays = 30 }) {
  const { expenses } = useExpensesStore()
  const { jars }     = useJarsStore()
  const { accounts } = useAccountsStore()

  return useMemo(() => {
    const liquidBalance = accounts
      .filter((a) => ['cash', 'bank', 'ewallet'].includes(a.type))
      .reduce((sum, a) => sum + (a.balance ?? 0), 0)

    const velocity = computeVelocity({ expenses, jars, liquidBalance, windowDays })

    const days = calcDaysUntilPayday(nextPayday)

    const safe = safeToSpend({
      liquidBalance,
      dailyBurnRate:   velocity.dailyBurnRate,
      daysUntilPayday: days,
    })

    return {
      ...velocity,
      daysUntilPayday:  days,
      safeToSpendToday: safe,
    }
  }, [expenses, jars, accounts, nextPayday, windowDays])
}
