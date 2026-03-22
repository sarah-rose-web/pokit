/**
 * smartSplitEngine.js
 * Pure JS — no React, no Firebase.
 *
 * Runs the 9-step zero-based budget waterfall on a net usable income amount.
 * Every step: Allocation = min(Target, RemainingBalance), then R = R - Allocation.
 * Engine stops when R = 0 or all steps are exhausted.
 */

/**
 * @typedef {Object} Jar
 * @property {string} id
 * @property {string} name
 * @property {'lidded'|'open'} type
 * @property {number} target
 * @property {number} balance
 * @property {string} [dueDate]   — ISO string
 */

/**
 * @typedef {Object} Goal
 * @property {string} id
 * @property {string} name
 * @property {number} targetAmount
 * @property {number} savedAmount
 * @property {string} targetDate  — ISO string
 */

/**
 * @typedef {Object} Debt
 * @property {string} id
 * @property {string} name
 * @property {number} principal
 * @property {number} apr
 * @property {number} minPayment
 * @property {string} dueDate     — ISO string
 * @property {number} paidSoFar
 */

/**
 * @typedef {Object} SplitAllocation
 * @property {string} id
 * @property {string} name
 * @property {number} allocated
 * @property {number} target
 */

/**
 * @typedef {Object} SplitStep
 * @property {number}            step
 * @property {string}            label
 * @property {SplitAllocation[]} allocations
 * @property {number}            totalAllocated
 * @property {number}            remainingAfter
 */

/**
 * @typedef {Object} SplitResult
 * @property {number}      netUsableIncome   — input after fees/conversion
 * @property {SplitStep[]} steps
 * @property {number}      totalAllocated
 * @property {number}      leftover
 * @property {Record<string, number>} byId  — flat map of id → allocated amount
 */

/**
 * @typedef {Object} SplitInput
 * @property {number}   netUsableIncome     — PHP amount after gateway fees + FX
 * @property {Goal[]}   goals
 * @property {Jar[]}    bills               — lidded jars with a dueDate in window
 * @property {Jar[]}    creditCards         — credit card minimum jars
 * @property {Debt[]}   debts
 * @property {Jar[]}    variableJars        — open honey pots
 * @property {Jar[]}    outsideWindowBills  — bills due after next payday
 * @property {number}   surplusPercent      — 0–100, user-set extra debt paydown %
 * @property {string}   nextPayday          — ISO string
 * @property {'snowball'|'avalanche'} debtStrategy
 */

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Allocate up to `target` from `remaining`. Returns [allocated, newRemaining].
 * @param {number} remaining
 * @param {number} target
 * @returns {[number, number]}
 */
function allocate(remaining, target) {
  const allocated = Math.min(target, remaining)
  return [allocated, remaining - allocated]
}

/**
 * Round to 2 decimal places to avoid floating point drift.
 * @param {number} n
 * @returns {number}
 */
const round2 = (n) => Math.round(n * 100) / 100

/**
 * Check whether a due date falls within the window (before next payday).
 * @param {string} dueDate   — ISO string
 * @param {string} nextPayday — ISO string
 * @returns {boolean}
 */
function isInWindow(dueDate, nextPayday) {
  if (!dueDate || !nextPayday) return false
  return new Date(dueDate) <= new Date(nextPayday)
}

/**
 * Sort debts by strategy.
 * Snowball: lowest balance (principal - paidSoFar) first.
 * Avalanche: highest APR first.
 * @param {Debt[]} debts
 * @param {'snowball'|'avalanche'} strategy
 * @returns {Debt[]}
 */
function sortDebts(debts, strategy) {
  return [...debts].sort((a, b) => {
    if (strategy === 'snowball') {
      const balA = a.principal - a.paidSoFar
      const balB = b.principal - b.paidSoFar
      return balA - balB
    }
    return b.apr - a.apr
  })
}

// ─── Main engine ──────────────────────────────────────────────────────────────

/**
 * Run the 9-step Smart Split Engine.
 * @param {SplitInput} input
 * @returns {SplitResult}
 */
export function runSmartSplit(input) {
  const {
    netUsableIncome,
    goals = [],
    bills = [],
    creditCards = [],
    debts = [],
    variableJars = [],
    outsideWindowBills = [],
    surplusPercent = 10,
    nextPayday,
    debtStrategy = 'avalanche',
  } = input

  let R = round2(netUsableIncome)
  const steps = []
  /** @type {Record<string, number>} */
  const byId = {}

  // ── Step 1: Goals (capped at 30% of net to protect bills) ─────────────────
  {
    const cap = round2(netUsableIncome * 0.30)
    let stepR = Math.min(R, cap)
    const allocations = []

    // Distribute evenly across incomplete goals, proportional to gap remaining
    const incompleteGoals = goals.filter(
      (g) => g.savedAmount < g.targetAmount
    )
    const totalGap = incompleteGoals.reduce(
      (sum, g) => sum + (g.targetAmount - g.savedAmount), 0
    )

    for (const goal of incompleteGoals) {
      if (stepR <= 0) break
      const gap = goal.targetAmount - goal.savedAmount
      // Proportional share of the capped budget
      const proportionalTarget = totalGap > 0
        ? round2(cap * (gap / totalGap))
        : 0
      const target = Math.min(gap, proportionalTarget)
      const [allocated, newStepR] = allocate(stepR, target)
      stepR = newStepR
      if (allocated > 0) {
        allocations.push({ id: goal.id, name: goal.name, allocated, target })
        byId[goal.id] = (byId[goal.id] ?? 0) + allocated
      }
    }

    const totalAllocated = allocations.reduce((s, a) => s + a.allocated, 0)
    R = round2(R - totalAllocated)

    steps.push({
      step: 1,
      label: 'Goals',
      allocations,
      totalAllocated,
      remainingAfter: R,
    })
  }

  // ── Step 2: Bills in window ────────────────────────────────────────────────
  {
    const inWindow = bills.filter((b) => isInWindow(b.dueDate, nextPayday))
    const allocations = []

    for (const bill of inWindow) {
      if (R <= 0) break
      const target = round2(Math.max(0, bill.target - bill.balance))
      const [allocated, newR] = allocate(R, target)
      R = newR
      if (allocated > 0) {
        allocations.push({ id: bill.id, name: bill.name, allocated, target })
        byId[bill.id] = (byId[bill.id] ?? 0) + allocated
      }
    }

    const totalAllocated = allocations.reduce((s, a) => s + a.allocated, 0)
    steps.push({
      step: 2,
      label: 'Bills due before next payday',
      allocations,
      totalAllocated,
      remainingAfter: R,
    })
  }

  // ── Step 3: Credit card minimums ──────────────────────────────────────────
  {
    const inWindow = creditCards.filter((c) => isInWindow(c.dueDate, nextPayday))
    const allocations = []

    for (const cc of inWindow) {
      if (R <= 0) break
      const target = round2(Math.max(0, cc.target - cc.balance))
      const [allocated, newR] = allocate(R, target)
      R = newR
      if (allocated > 0) {
        allocations.push({ id: cc.id, name: cc.name, allocated, target })
        byId[cc.id] = (byId[cc.id] ?? 0) + allocated
      }
    }

    const totalAllocated = allocations.reduce((s, a) => s + a.allocated, 0)
    steps.push({
      step: 3,
      label: 'Credit card minimums',
      allocations,
      totalAllocated,
      remainingAfter: R,
    })
  }

  // ── Step 4: Debt minimums ─────────────────────────────────────────────────
  {
    const inWindow = debts.filter((d) => isInWindow(d.dueDate, nextPayday))
    const allocations = []

    for (const debt of inWindow) {
      if (R <= 0) break
      const target = round2(debt.minPayment)
      const [allocated, newR] = allocate(R, target)
      R = newR
      if (allocated > 0) {
        allocations.push({ id: debt.id, name: debt.name, allocated, target })
        byId[debt.id] = (byId[debt.id] ?? 0) + allocated
      }
    }

    const totalAllocated = allocations.reduce((s, a) => s + a.allocated, 0)
    steps.push({
      step: 4,
      label: 'Debt minimums',
      allocations,
      totalAllocated,
      remainingAfter: R,
    })
  }

  // ── Step 5: Variable jars ─────────────────────────────────────────────────
  {
    const allocations = []

    for (const jar of variableJars) {
      if (R <= 0) break
      const target = round2(Math.max(0, jar.target - jar.balance))
      const [allocated, newR] = allocate(R, target)
      R = newR
      if (allocated > 0) {
        allocations.push({ id: jar.id, name: jar.name, allocated, target })
        byId[jar.id] = (byId[jar.id] ?? 0) + allocated
      }
    }

    const totalAllocated = allocations.reduce((s, a) => s + a.allocated, 0)
    steps.push({
      step: 5,
      label: 'Variable spending jars',
      allocations,
      totalAllocated,
      remainingAfter: R,
    })
  }

  // ── Step 6: Extra debt paydown ────────────────────────────────────────────
  {
    const allocations = []

    if (R > 0 && surplusPercent > 0 && debts.length > 0) {
      const extraBudget = round2(netUsableIncome * (surplusPercent / 100))
      const extra = Math.min(R, extraBudget)
      const sorted = sortDebts(debts, debtStrategy)
      const priorityDebt = sorted[0]

      if (priorityDebt && extra > 0) {
        const remaining = round2(priorityDebt.principal - priorityDebt.paidSoFar)
        const target = Math.min(extra, remaining)
        const [allocated, newR] = allocate(R, target)
        R = newR
        if (allocated > 0) {
          allocations.push({
            id: priorityDebt.id,
            name: `${priorityDebt.name} (extra)`,
            allocated,
            target,
          })
          byId[priorityDebt.id] = (byId[priorityDebt.id] ?? 0) + allocated
        }
      }
    }

    const totalAllocated = allocations.reduce((s, a) => s + a.allocated, 0)
    steps.push({
      step: 6,
      label: 'Extra debt paydown',
      allocations,
      totalAllocated,
      remainingAfter: R,
    })
  }

  // ── Step 7: Outside-window bills (pre-fund next month) ────────────────────
  {
    const allocations = []

    for (const bill of outsideWindowBills) {
      if (R <= 0) break
      const target = round2(Math.max(0, bill.target - bill.balance))
      const [allocated, newR] = allocate(R, target)
      R = newR
      if (allocated > 0) {
        allocations.push({ id: bill.id, name: bill.name, allocated, target })
        byId[bill.id] = (byId[bill.id] ?? 0) + allocated
      }
    }

    const totalAllocated = allocations.reduce((s, a) => s + a.allocated, 0)
    steps.push({
      step: 7,
      label: 'Pre-fund next month\'s bills',
      allocations,
      totalAllocated,
      remainingAfter: R,
    })
  }

  // ── Step 8: Extra savings (uncapped goals top-up) ─────────────────────────
  {
    const allocations = []
    const incompleteGoals = goals.filter((g) => g.savedAmount < g.targetAmount)

    for (const goal of incompleteGoals) {
      if (R <= 0) break
      const gap = round2(goal.targetAmount - goal.savedAmount)
      // Subtract what was already allocated in step 1
      const alreadyAllocated = byId[goal.id] ?? 0
      const remaining = round2(Math.max(0, gap - alreadyAllocated))
      if (remaining <= 0) continue

      const [allocated, newR] = allocate(R, remaining)
      R = newR
      if (allocated > 0) {
        allocations.push({ id: goal.id, name: goal.name, allocated, target: remaining })
        byId[goal.id] = (byId[goal.id] ?? 0) + allocated
      }
    }

    const totalAllocated = allocations.reduce((s, a) => s + a.allocated, 0)
    steps.push({
      step: 8,
      label: 'Extra savings',
      allocations,
      totalAllocated,
      remainingAfter: R,
    })
  }

  // ── Step 9: Leftover liquid buffer ────────────────────────────────────────
  {
    const leftover = round2(R)
    steps.push({
      step: 9,
      label: 'Leftover buffer',
      allocations: leftover > 0
        ? [{ id: 'leftover', name: 'Liquid buffer', allocated: leftover, target: leftover }]
        : [],
      totalAllocated: leftover,
      remainingAfter: 0,
    })
    R = 0
  }

  const totalAllocated = round2(netUsableIncome - R)

  return {
    netUsableIncome,
    steps,
    totalAllocated,
    leftover: steps[8].totalAllocated,
    byId,
  }
}

/**
 * Quick summary of a split result — used by the AI coach.
 * Returns a plain object with step totals by label.
 * @param {SplitResult} result
 * @returns {Record<string, number>}
 */
export function summarizeSplit(result) {
  return Object.fromEntries(
    result.steps.map((s) => [s.label, s.totalAllocated])
  )
}
