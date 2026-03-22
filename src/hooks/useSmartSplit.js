import { useMemo } from 'react'
import { useAuthStore, useJarsStore, useGoalsStore, useDebtsStore } from '@/store'
import { runSmartSplit } from '@/services/smartSplitEngine'

/**
 * Runs the Smart Split Engine reactively against the current store state.
 * Pass in netUsableIncome (after currency conversion + fees) to get a split result.
 *
 * @param {{
 *   netUsableIncome: number,
 *   nextPayday:      string,   — ISO string
 *   surplusPercent?: number,   — 0-100
 * }} params
 * @returns {import('@/services/smartSplitEngine').SplitResult | null}
 */
export function useSmartSplit({ netUsableIncome, nextPayday, surplusPercent = 10 }) {
  const { jars }     = useJarsStore()
  const { goals }    = useGoalsStore()
  const { debts, strategy: debtStrategy } = useDebtsStore()

  return useMemo(() => {
    if (!netUsableIncome || netUsableIncome <= 0 || !nextPayday) return null

    // Separate jars by role
    const bills       = jars.filter((j) => j.type === 'lidded' && j.dueDate && !j.name.toLowerCase().includes('cc'))
    const creditCards = jars.filter((j) => j.type === 'lidded' && j.name.toLowerCase().includes('cc'))
    const variableJars = jars.filter((j) => j.type === 'open')

    // Bills outside the paycheck window (pre-fund)
    const outsideWindowBills = bills.filter(
      (b) => b.dueDate && new Date(b.dueDate) > new Date(nextPayday)
    )
    const inWindowBills = bills.filter(
      (b) => !b.dueDate || new Date(b.dueDate) <= new Date(nextPayday)
    )

    return runSmartSplit({
      netUsableIncome,
      goals,
      bills:              inWindowBills,
      creditCards,
      debts,
      variableJars,
      outsideWindowBills,
      surplusPercent,
      nextPayday,
      debtStrategy,
    })
  }, [netUsableIncome, nextPayday, surplusPercent, jars, goals, debts, debtStrategy])
}
