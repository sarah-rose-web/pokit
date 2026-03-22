/**
 * netWorthEngine.js
 * Pure JS — no React, no Firebase.
 *
 * Calculates net worth, asset/liability breakdown,
 * and trend data for the Bedroom (Accounts) room.
 */

/**
 * @typedef {Object} Account
 * @property {string} id
 * @property {string} name
 * @property {'cash'|'bank'|'credit'|'ewallet'} type
 * @property {number} balance
 */

/**
 * @typedef {Object} Debt
 * @property {string} id
 * @property {string} name
 * @property {number} principal
 * @property {number} paidSoFar
 */

/**
 * @typedef {Object} Goal
 * @property {string} id
 * @property {string} name
 * @property {number} savedAmount
 */

/**
 * @typedef {Object} NetWorthResult
 * @property {number}   totalAssets
 * @property {number}   totalLiabilities
 * @property {number}   netWorth
 * @property {Object[]} assets        — labeled asset lines
 * @property {Object[]} liabilities   — labeled liability lines
 * @property {number}   liquidAssets  — cash + bank + ewallet
 * @property {number}   savedAssets   — goal savings
 */

/**
 * @param {{
 *   accounts: Account[],
 *   debts:    Debt[],
 *   goals:    Goal[],
 * }} params
 * @returns {NetWorthResult}
 */
export function computeNetWorth({ accounts, debts, goals }) {
  // ── Assets ────────────────────────────────────────────────────────────────

  // Account balances — credit accounts are liabilities, not assets
  const assetAccounts = accounts.filter((a) => a.type !== 'credit')
  const totalAccountAssets = round2(
    assetAccounts.reduce((sum, a) => sum + (a.balance ?? 0), 0)
  )

  // Goal savings (money set aside, treat as assets)
  const totalGoalSavings = round2(
    goals.reduce((sum, g) => sum + (g.savedAmount ?? 0), 0)
  )

  const totalAssets = round2(totalAccountAssets + totalGoalSavings)

  const assets = [
    ...assetAccounts.map((a) => ({
      id:     a.id,
      label:  a.name,
      type:   a.type,
      amount: a.balance ?? 0,
    })),
    ...goals
      .filter((g) => g.savedAmount > 0)
      .map((g) => ({
        id:     g.id,
        label:  `${g.name} (goal)`,
        type:   'goal',
        amount: g.savedAmount,
      })),
  ]

  // ── Liabilities ───────────────────────────────────────────────────────────

  // Outstanding debt balances
  const debtLiabilities = debts.map((d) => ({
    id:     d.id,
    label:  d.name,
    type:   'debt',
    amount: Math.max(0, round2(d.principal - d.paidSoFar)),
  }))

  // Credit card balances (negative account balances = owed)
  const creditAccounts = accounts.filter((a) => a.type === 'credit')
  const creditLiabilities = creditAccounts
    .filter((a) => (a.balance ?? 0) < 0)
    .map((a) => ({
      id:     a.id,
      label:  `${a.name} (credit)`,
      type:   'credit',
      amount: Math.abs(a.balance),
    }))

  const liabilities = [...debtLiabilities, ...creditLiabilities]

  const totalLiabilities = round2(
    liabilities.reduce((sum, l) => sum + l.amount, 0)
  )

  const netWorth = round2(totalAssets - totalLiabilities)

  // Liquid = cash + bank + ewallet (immediately accessible)
  const liquidAssets = round2(
    assetAccounts
      .filter((a) => ['cash', 'bank', 'ewallet'].includes(a.type))
      .reduce((sum, a) => sum + (a.balance ?? 0), 0)
  )

  return {
    totalAssets,
    totalLiabilities,
    netWorth,
    assets,
    liabilities,
    liquidAssets,
    savedAssets: totalGoalSavings,
  }
}

/**
 * Classify net worth sentiment for Pokkie's expression.
 * @param {number} netWorth
 * @returns {'positive'|'neutral'|'negative'}
 */
export function netWorthSentiment(netWorth) {
  if (netWorth > 0)  return 'positive'
  if (netWorth === 0) return 'neutral'
  return 'negative'
}

/**
 * @param {number} n
 * @returns {number}
 */
const round2 = (n) => Math.round(n * 100) / 100
