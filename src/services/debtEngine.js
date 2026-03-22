/**
 * debtEngine.js
 * Pure JS — no React, no Firebase.
 *
 * Snowball/Avalanche ordering, payoff projections,
 * interest calculations, and progress tracking.
 */

/**
 * @typedef {Object} Debt
 * @property {string} id
 * @property {string} name
 * @property {number} principal     — original loan amount
 * @property {number} apr           — annual percentage rate, e.g. 0.24 = 24%
 * @property {number} minPayment    — minimum monthly payment
 * @property {string} dueDate       — ISO string
 * @property {number} paidSoFar
 */

/**
 * @typedef {Object} DebtProjection
 * @property {string} id
 * @property {string} name
 * @property {number} balance          — current remaining balance
 * @property {number} monthsToPayoff
 * @property {string} payoffDate       — ISO string
 * @property {number} totalInterest    — total interest paid over life of debt
 * @property {number} totalPaid
 */

/**
 * @typedef {Object} DebtPlan
 * @property {'snowball'|'avalanche'} strategy
 * @property {Debt[]}            orderedDebts
 * @property {DebtProjection[]}  projections
 * @property {number}            totalMonthsToDebtFree
 * @property {string}            debtFreeDate
 * @property {number}            totalInterestPaid
 */

const MONTHS_IN_YEAR = 12

/**
 * Compute the monthly interest rate from APR.
 * @param {number} apr — e.g. 0.24 for 24%
 * @returns {number}
 */
const monthlyRate = (apr) => apr / MONTHS_IN_YEAR

/**
 * Remaining balance on a debt.
 * @param {Debt} debt
 * @returns {number}
 */
export const remainingBalance = (debt) =>
  Math.max(0, round2(debt.principal - debt.paidSoFar))

/**
 * Sort debts by strategy.
 * @param {Debt[]} debts
 * @param {'snowball'|'avalanche'} strategy
 * @returns {Debt[]}
 */
export function sortDebts(debts, strategy) {
  return [...debts].sort((a, b) => {
    if (strategy === 'snowball') {
      return remainingBalance(a) - remainingBalance(b)
    }
    return b.apr - a.apr
  })
}

/**
 * Project months to payoff for a single debt given a monthly payment.
 * Uses standard amortization formula.
 *
 * @param {number} balance      — current remaining balance
 * @param {number} apr          — annual rate e.g. 0.24
 * @param {number} monthlyPmt   — monthly payment amount
 * @returns {{ months: number, totalInterest: number, totalPaid: number }}
 */
export function projectPayoff(balance, apr, monthlyPmt) {
  if (balance <= 0) return { months: 0, totalInterest: 0, totalPaid: 0 }

  const r = monthlyRate(apr)

  // If 0% APR or payment covers balance immediately
  if (r === 0 || monthlyPmt >= balance) {
    const months = r === 0
      ? Math.ceil(balance / monthlyPmt)
      : 1
    return { months, totalInterest: 0, totalPaid: round2(balance) }
  }

  // If payment doesn't cover interest — debt would grow forever
  const interestThisMonth = round2(balance * r)
  if (monthlyPmt <= interestThisMonth) {
    return { months: Infinity, totalInterest: Infinity, totalPaid: Infinity }
  }

  // Standard amortization: n = -log(1 - r*B/P) / log(1 + r)
  const n = Math.ceil(
    -Math.log(1 - (r * balance) / monthlyPmt) / Math.log(1 + r)
  )

  // Simulate month by month for accurate interest total
  let bal = balance
  let totalInterest = 0
  let totalPaid = 0

  for (let i = 0; i < n && bal > 0; i++) {
    const interest = round2(bal * r)
    const payment  = Math.min(monthlyPmt, bal + interest)
    totalInterest += interest
    totalPaid     += payment
    bal = round2(bal + interest - payment)
  }

  return {
    months:        n,
    totalInterest: round2(totalInterest),
    totalPaid:     round2(totalPaid),
  }
}

/**
 * Build a full debt repayment plan using the chosen strategy.
 * Applies the "debt avalanche/snowball cascade" — when one debt is paid off,
 * its payment amount rolls into the next priority debt.
 *
 * @param {Debt[]} debts
 * @param {'snowball'|'avalanche'} strategy
 * @param {number} [extraMonthlyBudget=0] — extra PHP per month toward debt
 * @returns {DebtPlan}
 */
export function buildDebtPlan(debts, strategy, extraMonthlyBudget = 0) {
  if (debts.length === 0) {
    return {
      strategy,
      orderedDebts:          [],
      projections:           [],
      totalMonthsToDebtFree: 0,
      debtFreeDate:          new Date().toISOString(),
      totalInterestPaid:     0,
    }
  }

  const ordered   = sortDebts(debts, strategy)
  const balances  = Object.fromEntries(ordered.map((d) => [d.id, remainingBalance(d)]))
  const payments  = Object.fromEntries(ordered.map((d) => [d.id, d.minPayment]))
  const completed = new Set()

  // Assign extra budget to the first priority debt
  if (extraMonthlyBudget > 0 && ordered.length > 0) {
    payments[ordered[0].id] += extraMonthlyBudget
  }

  /** @type {Record<string, { month: number, interest: number, paid: number }>} */
  const results = {}

  const MAX_MONTHS = 600 // 50 year safety ceiling
  let month = 0

  while (completed.size < ordered.length && month < MAX_MONTHS) {
    month++

    for (const debt of ordered) {
      if (completed.has(debt.id)) continue

      const r        = monthlyRate(debt.apr)
      const interest = round2(balances[debt.id] * r)
      const payment  = Math.min(payments[debt.id], balances[debt.id] + interest)

      balances[debt.id] = round2(balances[debt.id] + interest - payment)

      if (!results[debt.id]) {
        results[debt.id] = { month: 0, interest: 0, paid: 0 }
      }
      results[debt.id].interest += interest
      results[debt.id].paid     += payment

      if (balances[debt.id] <= 0.01) {
        completed.add(debt.id)
        results[debt.id].month = month

        // Cascade: roll freed payment into next priority debt
        const nextDebt = ordered.find((d) => !completed.has(d.id))
        if (nextDebt) {
          payments[nextDebt.id] += payments[debt.id]
        }
      }
    }
  }

  const now = new Date()

  /** @type {DebtProjection[]} */
  const projections = ordered.map((debt) => {
    const r = results[debt.id] ?? { month: MAX_MONTHS, interest: 0, paid: 0 }
    const payoffDate = new Date(now)
    payoffDate.setMonth(payoffDate.getMonth() + r.month)

    return {
      id:               debt.id,
      name:             debt.name,
      balance:          remainingBalance(debt),
      monthsToPayoff:   r.month,
      payoffDate:       payoffDate.toISOString(),
      totalInterest:    round2(r.interest),
      totalPaid:        round2(r.paid),
    }
  })

  const totalMonthsToDebtFree = Math.max(...projections.map((p) => p.monthsToPayoff))
  const debtFreeDate = new Date(now)
  debtFreeDate.setMonth(debtFreeDate.getMonth() + totalMonthsToDebtFree)

  const totalInterestPaid = round2(
    projections.reduce((sum, p) => sum + p.totalInterest, 0)
  )

  return {
    strategy,
    orderedDebts:          ordered,
    projections,
    totalMonthsToDebtFree,
    debtFreeDate:          debtFreeDate.toISOString(),
    totalInterestPaid,
  }
}

/**
 * Compare savings between snowball and avalanche strategies.
 * @param {Debt[]} debts
 * @param {number} [extraMonthlyBudget=0]
 * @returns {{ snowball: DebtPlan, avalanche: DebtPlan, interestSavedByAvalanche: number, monthsSavedByAvalanche: number }}
 */
export function compareStrategies(debts, extraMonthlyBudget = 0) {
  const snowball  = buildDebtPlan(debts, 'snowball',  extraMonthlyBudget)
  const avalanche = buildDebtPlan(debts, 'avalanche', extraMonthlyBudget)

  return {
    snowball,
    avalanche,
    interestSavedByAvalanche: round2(snowball.totalInterestPaid - avalanche.totalInterestPaid),
    monthsSavedByAvalanche:   snowball.totalMonthsToDebtFree - avalanche.totalMonthsToDebtFree,
  }
}

/**
 * Progress percentage for a single debt.
 * @param {Debt} debt
 * @returns {number} 0–100
 */
export function debtProgress(debt) {
  if (debt.principal <= 0) return 100
  return Math.min(100, round2((debt.paidSoFar / debt.principal) * 100))
}

/**
 * @param {number} n
 * @returns {number}
 */
const round2 = (n) => Math.round(n * 100) / 100
