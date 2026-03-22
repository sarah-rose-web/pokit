/**
 * tarotEngine.js
 * Pure JS — no React, no Firebase.
 *
 * Defines the 12-card Pokit tarot deck and builds
 * the structured AI prompt for the Oracle room.
 *
 * AI response format (enforced via prompt):
 * CARD: <card name>
 * VERDICT: YES | THINK TWICE | NOPE
 * REASON: <under 60 words, uses exact numbers>
 */

/**
 * @typedef {Object} TarotCard
 * @property {string}   id
 * @property {string}   name
 * @property {string}   emoji
 * @property {string}   theme       — financial theme this card governs
 * @property {string}   upright     — meaning when drawn
 * @property {string}   reversed    — shadow/warning meaning
 * @property {string}   cssClass    — for skeuomorphic card styling
 */

/** @type {TarotCard[]} */
export const TAROT_DECK = [
  {
    id:       'the-peso',
    name:     'The Peso',
    emoji:    '₱',
    theme:    'Income & cash flow',
    upright:  'Money is moving. Trust the inflow.',
    reversed: 'Cash is leaking through hidden fees or impulse spending.',
    cssClass: 'card--gold',
  },
  {
    id:       'the-jar',
    name:     'The Jar',
    emoji:    '🍯',
    theme:    'Savings & allocation',
    upright:  'Every peso has a home. Your system is working.',
    reversed: 'Money sitting idle without purpose is money already spent.',
    cssClass: 'card--amber',
  },
  {
    id:       'the-spiral',
    name:     'The Spiral',
    emoji:    '🌀',
    theme:    'Debt & obligations',
    upright:  'Debt is manageable. Keep the momentum.',
    reversed: 'The minimum payment trap is circling. Act now.',
    cssClass: 'card--indigo',
  },
  {
    id:       'the-star',
    name:     'The Star',
    emoji:    '⭐',
    theme:    'Goals & aspirations',
    upright:  'Your goal is within reach. Stay consistent.',
    reversed: 'A goal without a date is just a wish.',
    cssClass: 'card--teal',
  },
  {
    id:       'the-receipt',
    name:     'The Receipt',
    emoji:    '🧾',
    theme:    'Spending & accountability',
    upright:  'Clarity on where the money went brings peace.',
    reversed: 'Untracked spending is invisible debt to your future self.',
    cssClass: 'card--paper',
  },
  {
    id:       'the-scale',
    name:     'The Scale',
    emoji:    '⚖️',
    theme:    'Balance & trade-offs',
    upright:  'You can have it — just not all at once.',
    reversed: 'Choosing everything is choosing nothing.',
    cssClass: 'card--sage',
  },
  {
    id:       'the-clock',
    name:     'The Clock',
    emoji:    '🕰️',
    theme:    'Timing & patience',
    upright:  'Compound interest rewards those who wait.',
    reversed: 'Delaying a hard financial decision costs more each day.',
    cssClass: 'card--rust',
  },
  {
    id:       'the-piggy',
    name:     'The Piggy',
    emoji:    '🐷',
    theme:    'Emergency fund & safety',
    upright:  'Your safety net is holding. Keep feeding it.',
    reversed: 'One unexpected bill away from crisis. Build the buffer.',
    cssClass: 'card--pink',
  },
  {
    id:       'the-knife',
    name:     'The Knife',
    emoji:    '🔪',
    theme:    'Cutting costs & discipline',
    upright:  'The cut that hurts now saves you later.',
    reversed: 'What you refuse to cut is controlling you.',
    cssClass: 'card--steel',
  },
  {
    id:       'the-moon',
    name:     'The Moon',
    emoji:    '🌙',
    theme:    'Uncertainty & irregular income',
    upright:  'Feast-and-famine cycles are manageable with a buffer.',
    reversed: 'Spending at feast-pace during famine is the trap.',
    cssClass: 'card--midnight',
  },
  {
    id:       'the-seed',
    name:     'The Seed',
    emoji:    '🌱',
    theme:    'Investment & growth',
    upright:  'Small consistent amounts compound into freedom.',
    reversed: 'Waiting for the perfect moment to invest is waiting forever.',
    cssClass: 'card--green',
  },
  {
    id:       'the-fire',
    name:     'The Fire',
    emoji:    '🔥',
    theme:    'Urgency & risk',
    upright:  'Urgency can be a gift — it forces decisive action.',
    reversed: 'Panic-spending extinguishes more than just the emergency.',
    cssClass: 'card--flame',
  },
]

/**
 * Draw a card deterministically based on the question text.
 * Same question always draws the same card — repeatable for the user.
 * @param {string} question
 * @returns {TarotCard}
 */
export function drawCard(question) {
  const hash = simpleHash(question.trim().toLowerCase())
  const index = Math.abs(hash) % TAROT_DECK.length
  return TAROT_DECK[index]
}

/**
 * Draw a random card.
 * @returns {TarotCard}
 */
export function drawRandomCard() {
  return TAROT_DECK[Math.floor(Math.random() * TAROT_DECK.length)]
}

/**
 * Build the AI prompt for a tarot reading.
 * @param {{
 *   question:    string,
 *   card:        TarotCard,
 *   netWorth:    number,
 *   liquidBalance: number,
 *   totalDebt:   number,
 *   monthlyBurnRate: number,
 *   goals:       { name: string, savedAmount: number, targetAmount: number }[],
 * }} params
 * @returns {{ systemPrompt: string, userMessage: string }}
 */
export function buildTarotPrompt({ question, card, netWorth, liquidBalance, totalDebt, monthlyBurnRate, goals }) {
  const topGoal = goals[0]

  const systemPrompt = `You are Pokit's Financial Tarot Oracle — cryptic, grounded, and data-driven. 
You have drawn a card for the user. Respond in EXACTLY this format with no deviation:

CARD: ${card.name}
VERDICT: YES | THINK TWICE | NOPE
REASON: (under 60 words, must reference exact numbers from the user's financial data, no fluff)

Rules:
- VERDICT must be one of: YES, THINK TWICE, or NOPE
- REASON must use at least one specific number from their finances
- Do not soften bad verdicts. Be honest but not cruel.
- Do not add any text outside the three fields above.`

  const userMessage = `The card drawn is: ${card.name} — "${card.upright}"

My question: ${question}

My financial snapshot:
- Net worth: ₱${netWorth.toLocaleString()}
- Liquid balance: ₱${liquidBalance.toLocaleString()}
- Total outstanding debt: ₱${totalDebt.toLocaleString()}
- Monthly burn rate: ₱${monthlyBurnRate.toLocaleString()}
${topGoal ? `- Top goal: ${topGoal.name} — ₱${topGoal.savedAmount.toLocaleString()} saved of ₱${topGoal.targetAmount.toLocaleString()}` : ''}

Give me a reading.`

  return { systemPrompt, userMessage }
}

/**
 * Parse the AI's tarot response into structured data.
 * @param {string} raw  — AI response text
 * @returns {{ card: string, verdict: 'YES'|'THINK TWICE'|'NOPE'|null, reason: string }}
 */
export function parseTarotResponse(raw) {
  const cardMatch    = raw.match(/CARD:\s*(.+)/i)
  const verdictMatch = raw.match(/VERDICT:\s*(YES|THINK TWICE|NOPE)/i)
  const reasonMatch  = raw.match(/REASON:\s*([\s\S]+?)(?:\n[A-Z]+:|$)/i)

  return {
    card:    cardMatch?.[1]?.trim()    ?? '',
    verdict: /** @type {any} */ (verdictMatch?.[1]?.toUpperCase()) ?? null,
    reason:  reasonMatch?.[1]?.trim()  ?? raw,
  }
}

/**
 * Simple deterministic string hash (djb2).
 * @param {string} str
 * @returns {number}
 */
function simpleHash(str) {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i)
  }
  return hash >>> 0
}
