import { useMemo } from 'react'
import { useDebtsStore } from '@/store'
import { buildDebtPlan, compareStrategies, debtProgress } from '@/services/debtEngine'

/**
 * Returns the active debt plan + comparison data.
 * @param {{ extraMonthlyBudget?: number }} [options]
 * @returns {{
 *   plan:              import('@/services/debtEngine').DebtPlan,
 *   comparison:        ReturnType<typeof compareStrategies>,
 *   totalRemaining:    number,
 *   progressByDebt:    Record<string, number>,
 * }}
 */
export function useDebtPriority({ extraMonthlyBudget = 0 } = {}) {
  const { debts, strategy } = useDebtsStore()

  return useMemo(() => {
    const plan = buildDebtPlan(debts, strategy, extraMonthlyBudget)
    const comparison = compareStrategies(debts, extraMonthlyBudget)

    const totalRemaining = debts.reduce(
      (sum, d) => sum + Math.max(0, d.principal - d.paidSoFar), 0
    )

    const progressByDebt = Object.fromEntries(
      debts.map((d) => [d.id, debtProgress(d)])
    )

    return { plan, comparison, totalRemaining, progressByDebt }
  }, [debts, strategy, extraMonthlyBudget])
}
