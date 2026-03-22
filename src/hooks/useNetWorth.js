import { useMemo } from 'react'
import { useAccountsStore, useDebtsStore, useGoalsStore } from '@/store'
import { computeNetWorth, netWorthSentiment } from '@/services/netWorthEngine'

/**
 * Computes net worth reactively from store state.
 * @returns {{
 *   netWorth:         number,
 *   totalAssets:      number,
 *   totalLiabilities: number,
 *   liquidAssets:     number,
 *   savedAssets:      number,
 *   assets:           object[],
 *   liabilities:      object[],
 *   sentiment:        'positive'|'neutral'|'negative',
 * }}
 */
export function useNetWorth() {
  const { accounts } = useAccountsStore()
  const { debts }    = useDebtsStore()
  const { goals }    = useGoalsStore()

  return useMemo(() => {
    const result    = computeNetWorth({ accounts, debts, goals })
    const sentiment = netWorthSentiment(result.netWorth)
    return { ...result, sentiment }
  }, [accounts, debts, goals])
}
