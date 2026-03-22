import { useState, useCallback } from 'react'
import { computeNetUsableIncome, GATEWAY_FEES } from '@/services/currencyEngine'

/**
 * Handles FX rate fetching and net income computation for the Paycheck room.
 *
 * @returns {{
 *   exchangeRate:      number | null,
 *   fetchRate:         (from: string, to?: string) => Promise<void>,
 *   computeNet:        (params: object) => ReturnType<typeof computeNetUsableIncome>,
 *   loading:           boolean,
 *   error:             string | null,
 *   gatewayOptions:    { value: string, label: string }[],
 * }}
 */
export function useCurrency() {
  const [exchangeRate, setExchangeRate] = useState(null)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState(null)

  /**
   * Fetch exchange rate from the CF Pages proxy.
   * @param {string} from — ISO 4217 currency code
   * @param {string} [to='PHP']
   */
  const fetchRate = useCallback(async (from, to = 'PHP') => {
    if (from === 'PHP' || from === to) {
      setExchangeRate(1)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res  = await fetch(`/api/fx-proxy?from=${from}&to=${to}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.error ?? 'Failed to fetch rate')

      setExchangeRate(data.rate)
    } catch (err) {
      setError(err.message)
      setExchangeRate(null)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Compute net usable income using the fetched exchange rate.
   * Falls back to rate=1 if not yet loaded.
   * @param {{ grossAmount: number, currency: string, gateway: string }} params
   */
  const computeNet = useCallback((params) => {
    return computeNetUsableIncome({
      ...params,
      exchangeRate: exchangeRate ?? 1,
    })
  }, [exchangeRate])

  const gatewayOptions = Object.entries(GATEWAY_FEES).map(([value, { label }]) => ({
    value,
    label,
  }))

  return { exchangeRate, fetchRate, computeNet, loading, error, gatewayOptions }
}
