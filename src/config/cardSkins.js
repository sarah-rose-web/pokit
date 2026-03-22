/**
 * cardSkins.js
 * Dictionary of card skin presets for Philippine banks, e-wallets, and international platforms.
 * Each skin maps to a skinId stored on the account document.
 *
 * @typedef {{ id: string, name: string, category: string, bg: string, text: string }} CardSkin
 */

/** @type {CardSkin[]} */
export const CARD_SKINS = [
  // ── Local Banks ───────────────────────────────────────
  { id: 'bdo',         name: 'BDO',          category: 'local', bg: 'linear-gradient(135deg, #8B1A1A 0%, #5C0F0F 100%)',  text: '#fff' },
  { id: 'bpi',         name: 'BPI',          category: 'local', bg: 'linear-gradient(135deg, #00338D 0%, #001F5C 100%)',  text: '#fff' },
  { id: 'unionbank',   name: 'UnionBank',    category: 'local', bg: 'linear-gradient(135deg, #1B3A7A 0%, #0F2455 100%)',  text: '#fff' },
  { id: 'metrobank',   name: 'Metrobank',    category: 'local', bg: 'linear-gradient(135deg, #4A5568 0%, #2D3748 100%)',  text: '#fff' },
  { id: 'securitybank',name: 'Security Bank',category: 'local', bg: 'linear-gradient(135deg, #C9A227 0%, #8B6914 100%)',  text: '#fff' },
  { id: 'rcbc',        name: 'RCBC',         category: 'local', bg: 'linear-gradient(135deg, #CC0000 0%, #8B0000 100%)',  text: '#fff' },
  { id: 'landbank',    name: 'Landbank',     category: 'local', bg: 'linear-gradient(135deg, #2D6A2D 0%, #1A4A1A 100%)',  text: '#fff' },
  { id: 'pnb',         name: 'PNB',          category: 'local', bg: 'linear-gradient(135deg, #003087 0%, #001F5C 100%)',  text: '#fff' },
  { id: 'eastwest',    name: 'EastWest',     category: 'local', bg: 'linear-gradient(135deg, #007B7F 0%, #005558 100%)',  text: '#fff' },
  { id: 'chinabank',   name: 'China Bank',   category: 'local', bg: 'linear-gradient(135deg, #8B0000 0%, #5C0000 100%)',  text: '#fff' },
  { id: 'psbank',      name: 'PSBank',       category: 'local', bg: 'linear-gradient(135deg, #0057A8 0%, #003D78 100%)',  text: '#fff' },
  { id: 'pbcom',       name: 'PBCOM',        category: 'local', bg: 'linear-gradient(135deg, #1C2951 0%, #0E1830 100%)',  text: '#fff' },

  // ── E-wallets ─────────────────────────────────────────
  { id: 'gcash',       name: 'GCash',        category: 'ewallet', bg: 'linear-gradient(135deg, #007DFF 0%, #0058B8 100%)', text: '#fff' },
  { id: 'maya',        name: 'Maya',         category: 'ewallet', bg: 'linear-gradient(135deg, #00A878 0%, #007555 100%)', text: '#fff' },
  { id: 'shoppepay',   name: 'ShopeePay',    category: 'ewallet', bg: 'linear-gradient(135deg, #EE4D2D 0%, #CC3010 100%)', text: '#fff' },
  { id: 'grabpay',     name: 'GrabPay',      category: 'ewallet', bg: 'linear-gradient(135deg, #00B14F 0%, #007A36 100%)', text: '#fff' },
  { id: 'coins',       name: 'Coins.ph',     category: 'ewallet', bg: 'linear-gradient(135deg, #6B21A8 0%, #4C1778 100%)', text: '#fff' },

  // ── International ─────────────────────────────────────
  { id: 'paypal',      name: 'PayPal',       category: 'international', bg: 'linear-gradient(135deg, #003087 0%, #001F5C 100%)', text: '#fff' },
  { id: 'wise',        name: 'Wise',         category: 'international', bg: 'linear-gradient(135deg, #37B648 0%, #1F7A2A 100%)', text: '#fff' },
  { id: 'crypto',      name: 'Crypto',       category: 'international', bg: 'linear-gradient(135deg, #26A17B 0%, #1A7055 100%)', text: '#fff' },

  // ── Generic fallbacks ─────────────────────────────────
  { id: 'cash',        name: 'Cash',         category: 'generic', bg: 'linear-gradient(135deg, #5C7A4E 0%, #3D5235 100%)', text: '#fff' },
  { id: 'dark',        name: 'Dark',         category: 'generic', bg: 'linear-gradient(135deg, #2C2C2C 0%, #1A1A1A 100%)', text: '#fff' },
  { id: 'rose',        name: 'Rose',         category: 'generic', bg: 'linear-gradient(135deg, #D4788E 0%, #A84E64 100%)', text: '#fff' },
  { id: 'gold',        name: 'Gold',         category: 'generic', bg: 'linear-gradient(135deg, #D4A84B 0%, #A07820 100%)', text: '#fff' },
  { id: 'navy',        name: 'Navy',         category: 'generic', bg: 'linear-gradient(135deg, #2D3561 0%, #1A2040 100%)', text: '#fff' },
  { id: 'purple',      name: 'Purple',       category: 'generic', bg: 'linear-gradient(135deg, #6B4E8C 0%, #4A3260 100%)', text: '#fff' },
]

export const SKIN_CATEGORIES = [
  { id: 'local',         label: 'Local Banks' },
  { id: 'ewallet',       label: 'E-wallets' },
  { id: 'international', label: 'International' },
  { id: 'generic',       label: 'Generic' },
]

/**
 * Look up a skin by id. Falls back to navy if not found.
 * @param {string | null | undefined} skinId
 * @returns {CardSkin}
 */
export function getSkin(skinId) {
  return CARD_SKINS.find((s) => s.id === skinId) ?? CARD_SKINS.find((s) => s.id === 'navy')
}
