/**
 * currencyEngine.js
 * Pure JS — no React, no Firebase.
 *
 * Handles currency conversion and gateway fee deductions
 * to produce the netUsableIncome fed into the Smart Split Engine.
 */

/**
 * @typedef {'paypal'|'wise'|'gcash'|'maya'|'direct'|'bank'|'crypto'} Gateway
 */

/**
 * Fee structures per gateway.
 * percentFee: applied to gross amount
 * flatFee: fixed PHP deduction (in PHP, already converted)
 * fxSpreadPercent: additional spread on top of mid-market rate
 *
 * Sources: approximate real-world rates as of 2024.
 * User can override in Settings if rates change.
 *
 * @type {Record<Gateway, { percentFee: number, flatFee: number, fxSpreadPercent: number, label: string }>}
 */
export const GATEWAY_FEES = {
  paypal: {
    label:            'PayPal',
    percentFee:       0.0349,   // 3.49%
    flatFee:          0,
    fxSpreadPercent:  0.03,     // ~3% spread on mid-market
  },
  wise: {
    label:            'Wise',
    percentFee:       0.0064,   // ~0.64% variable
    flatFee:          0,
    fxSpreadPercent:  0.005,    // tight spread ~0.5%
  },
  gcash: {
    label:            'GCash',
    percentFee:       0,
    flatFee:          0,
    fxSpreadPercent:  0,        // PHP in, no conversion needed
  },
  maya: {
    label:            'Maya',
    percentFee:       0,
    flatFee:          0,
    fxSpreadPercent:  0,
  },
  direct: {
    label:            'Direct Bank Transfer',
    percentFee:       0,
    flatFee:          0,
    fxSpreadPercent:  0,
  },
  bank: {
    label:            'Bank Wire',
    percentFee:       0,
    flatFee:          250,      // ~₱250 incoming wire fee
    fxSpreadPercent:  0.015,    // ~1.5% bank spread
  },
  crypto: {
    label:            'Crypto (USDT/USDC)',
    percentFee:       0.001,    // 0.1% network/exchange fee
    flatFee:          0,
    fxSpreadPercent:  0.005,
  },
}

/**
 * Convert a foreign currency amount to PHP using a given rate,
 * then deduct gateway fees to get net usable income.
 *
 * @param {{
 *   grossAmount:  number,   — amount in original currency
 *   currency:     string,   — ISO 4217, e.g. 'USD'
 *   gateway:      Gateway,
 *   exchangeRate: number,   — 1 unit of `currency` = N PHP (mid-market)
 * }} params
 * @returns {{
 *   grossPHP:        number,
 *   fxSpreadLoss:    number,
 *   gatewayFee:      number,
 *   netUsableIncome: number,
 *   breakdown:       { label: string, amount: number }[]
 * }}
 */
export function computeNetUsableIncome({ grossAmount, currency, gateway, exchangeRate }) {
  const fees = GATEWAY_FEES[gateway] ?? GATEWAY_FEES.direct

  // Step 1: convert to PHP at mid-market rate
  const grossPHP = currency === 'PHP'
    ? grossAmount
    : round2(grossAmount * exchangeRate)

  // Step 2: FX spread loss (applied to gross PHP)
  const fxSpreadLoss = round2(grossPHP * fees.fxSpreadPercent)
  const afterSpread  = round2(grossPHP - fxSpreadLoss)

  // Step 3: gateway percentage fee
  const percentFeeAmount = round2(afterSpread * fees.percentFee)

  // Step 4: flat fee (already in PHP)
  const flatFeeAmount = fees.flatFee

  const gatewayFee = round2(percentFeeAmount + flatFeeAmount)

  const netUsableIncome = round2(afterSpread - gatewayFee)

  const breakdown = [
    { label: `Gross (${currency})`, amount: grossAmount },
    { label: 'Converted to PHP',    amount: grossPHP },
  ]

  if (fxSpreadLoss > 0) {
    breakdown.push({ label: `${fees.label} FX spread`, amount: -fxSpreadLoss })
  }
  if (percentFeeAmount > 0) {
    breakdown.push({ label: `${fees.label} fee (${(fees.percentFee * 100).toFixed(2)}%)`, amount: -percentFeeAmount })
  }
  if (flatFeeAmount > 0) {
    breakdown.push({ label: `${fees.label} flat fee`, amount: -flatFeeAmount })
  }

  breakdown.push({ label: 'Net usable income', amount: netUsableIncome })

  return { grossPHP, fxSpreadLoss, gatewayFee, netUsableIncome, breakdown }
}

/**
 * Format a PHP amount as a readable string.
 * @param {number} amount
 * @param {{ compact?: boolean }} [options]
 * @returns {string}
 */
export function formatPHP(amount, { compact = false } = {}) {
  if (compact && Math.abs(amount) >= 1000) {
    return `₱${(amount / 1000).toFixed(1)}k`
  }
  return new Intl.NumberFormat('en-PH', {
    style:                 'currency',
    currency:              'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format any currency amount.
 * @param {number} amount
 * @param {string} currency — ISO 4217
 * @returns {string}
 */
export function formatCurrency(amount, currency = 'PHP') {
  return new Intl.NumberFormat('en-PH', {
    style:                 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * @param {number} n
 * @returns {number}
 */
const round2 = (n) => Math.round(n * 100) / 100
