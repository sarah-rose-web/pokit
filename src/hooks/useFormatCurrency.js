import { useCallback } from 'react'
import { useAuthStore } from '@/store/authStore'
import { formatCurrency } from '@/services/currencyEngine'

/**
 * Returns a formatter function bound to the user's base currency.
 * Falls back to PHP if no profile is loaded yet.
 *
 * @returns {{
 *   format:        (amount: number, options?: { compact?: boolean }) => string,
 *   currencyCode:  string,
 * }}
 *
 * @example
 * const { format } = useFormatCurrency()
 * format(12500)           // "₱12,500.00" or "$12,500.00" etc.
 * format(12500, { compact: true })  // "₱12.5k"
 */
export function useFormatCurrency() {
  const currency = useAuthStore((s) => s.profile?.currency ?? 'PHP')

  const format = useCallback((amount, { compact = false } = {}) => {
    if (compact && Math.abs(amount) >= 1000) {
      const symbol = getCurrencySymbol(currency)
      return `${symbol}${(amount / 1000).toFixed(1)}k`
    }
    return formatCurrency(amount, currency)
  }, [currency])

  return { format, currencyCode: currency }
}

/**
 * Get the currency symbol for compact formatting.
 * @param {string} currency — ISO 4217
 * @returns {string}
 */
function getCurrencySymbol(currency) {
  return new Intl.NumberFormat('en', { style: 'currency', currency })
    .formatToParts(0)
    .find((p) => p.type === 'currency')?.value ?? currency
}
