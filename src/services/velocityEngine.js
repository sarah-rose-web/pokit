/**
 * velocityEngine.js
 * Pure JS — no React, no Firebase.
 *
 * Calculates spending velocity (burn rate), jar depletion estimates,
 * and safe-to-spend amounts for the Home dashboard and Jars room.
 */

/**
 * @typedef {Object} Expense
 * @property {string} id
 * @property {number} amount
 * @property {string} [jarId]
 * @property {string} createdAt  — ISO string
 */

/**
 * @typedef {Object} Jar
 * @property {string} id
 * @property {string} name
 * @property {number} target
 * @property {number} balance
 */

/**
 * @typedef {Object} VelocityResult
 * @property {number} dailyBurnRate        — average PHP spent per day
 * @property {number} weeklyBurnRate
 * @property {number} monthlyBurnRate
 * @property {number} daysUntilEmpty       — based on current liquid balance
 * @property {Record<string, JarVelocity>} byJar
 */

/**
 * @typedef {Object} JarVelocity
 * @property {string} jarId
 * @property {string} jarName
 * @property {number} balance
 * @property {number} dailySpend
 * @property {number} daysUntilEmpty
 * @property {'healthy'|'watch'|'low'|'empty'} status
 */

/**
 * Filter expenses to a time window.
 * @param {Expense[]} expenses
 * @param {number}    days
 * @returns {Expense[]}
 */
function recentExpenses(expenses, days) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
  return expenses.filter((e) => new Date(e.createdAt).getTime() >= cutoff)
}

/**
 * Compute spending velocity across all jars and total.
 * @param {{
 *   expenses:      Expense[],
 *   jars:          Jar[],
 *   liquidBalance: number,   — total liquid PHP available (cash + bank)
 *   windowDays?:   number,   — lookback window, default 30
 * }} params
 * @returns {VelocityResult}
 */
export function computeVelocity({ expenses, jars, liquidBalance, windowDays = 30 }) {
  const window   = recentExpenses(expenses, windowDays)
  const totalSpent = window.reduce((sum, e) => sum + e.amount, 0)

  const dailyBurnRate   = round2(totalSpent / windowDays)
  const weeklyBurnRate  = round2(dailyBurnRate * 7)
  const monthlyBurnRate = round2(dailyBurnRate * 30)

  const daysUntilEmpty = dailyBurnRate > 0
    ? round2(liquidBalance / dailyBurnRate)
    : Infinity

  // Per-jar velocity
  /** @type {Record<string, JarVelocity>} */
  const byJar = {}

  for (const jar of jars) {
    const jarExpenses = window.filter((e) => e.jarId === jar.id)
    const jarSpent    = jarExpenses.reduce((sum, e) => sum + e.amount, 0)
    const dailySpend  = round2(jarSpent / windowDays)
    const daysLeft    = dailySpend > 0
      ? round2(jar.balance / dailySpend)
      : Infinity

    const fillPercent = jar.target > 0 ? jar.balance / jar.target : 0

    byJar[jar.id] = {
      jarId:          jar.id,
      jarName:        jar.name,
      balance:        jar.balance,
      dailySpend,
      daysUntilEmpty: daysLeft,
      status:         jarStatus(fillPercent, daysLeft),
    }
  }

  return {
    dailyBurnRate,
    weeklyBurnRate,
    monthlyBurnRate,
    daysUntilEmpty,
    byJar,
  }
}

/**
 * Determine jar health status.
 * @param {number} fillPercent  — 0–1
 * @param {number} daysLeft
 * @returns {'healthy'|'watch'|'low'|'empty'}
 */
function jarStatus(fillPercent, daysLeft) {
  if (fillPercent <= 0)    return 'empty'
  if (fillPercent < 0.15)  return 'low'
  if (daysLeft < 7)        return 'watch'
  return 'healthy'
}

/**
 * Safe-to-spend today — balance minus projected spend until next payday.
 * @param {{
 *   liquidBalance: number,
 *   dailyBurnRate: number,
 *   daysUntilPayday: number,
 * }} params
 * @returns {number}
 */
export function safeToSpend({ liquidBalance, dailyBurnRate, daysUntilPayday }) {
  const projectedSpend = round2(dailyBurnRate * daysUntilPayday)
  return round2(Math.max(0, liquidBalance - projectedSpend))
}

/**
 * Days until next payday from today.
 * @param {string} nextPayday — ISO string
 * @returns {number}
 */
export function daysUntilPayday(nextPayday) {
  const now  = new Date()
  const next = new Date(nextPayday)
  const diff = next.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

/**
 * @param {number} n
 * @returns {number}
 */
const round2 = (n) => Math.round(n * 100) / 100
