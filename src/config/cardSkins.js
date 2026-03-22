/**
 * cardSkins.js
 * Real card variants for PH banks, e-wallets, and international platforms.
 *
 * @typedef {{ id: string, name: string, type: string, colors: { bg: string, text: string }, logoUrl: string | null }} CardSkin
 */

/** @type {CardSkin[]} */
export const CARD_SKINS = [
  // ── E-wallets & Digital Banks ──────────────────────────
  { id: 'gcash',         name: 'GCash Mastercard',      type: 'ewallet',       colors: { bg: '#007DFE',                                                  text: '#FFFFFF' }, logoUrl: 'https://logo.clearbit.com/gcash.com' },
  { id: 'maya-dark',     name: 'Maya Card (Black)',      type: 'ewallet',       colors: { bg: '#111111',                                                  text: '#00E570' }, logoUrl: 'https://logo.clearbit.com/maya.ph' },
  { id: 'maya-green',    name: 'Maya Card (Green)',      type: 'ewallet',       colors: { bg: '#00E570',                                                  text: '#111111' }, logoUrl: 'https://logo.clearbit.com/maya.ph' },
  { id: 'gotyme',        name: 'GoTyme Visa',            type: 'ewallet',       colors: { bg: 'linear-gradient(135deg, #00D1FF 0%, #0047FF 100%)',         text: '#FFFFFF' }, logoUrl: 'https://logo.clearbit.com/gotyme.com.ph' },
  { id: 'seabank',       name: 'SeaBank Debit',          type: 'ewallet',       colors: { bg: '#FF6B00',                                                  text: '#FFFFFF' }, logoUrl: 'https://logo.clearbit.com/seabank.ph' },
  { id: 'tonik',         name: 'Tonik Stash',            type: 'ewallet',       colors: { bg: '#5A2E8A',                                                  text: '#FFCC00' }, logoUrl: 'https://logo.clearbit.com/tonikbank.com' },

  // ── BPI ────────────────────────────────────────────────
  { id: 'bpi-debit',     name: 'BPI Debit Classic',     type: 'local_bank',    colors: { bg: '#B22222',                                                  text: '#FFFFFF' }, logoUrl: 'https://logo.clearbit.com/bpi.com.ph' },
  { id: 'bpi-blue',      name: 'BPI Blue Credit',       type: 'local_bank',    colors: { bg: '#003087',                                                  text: '#FFFFFF' }, logoUrl: 'https://logo.clearbit.com/bpi.com.ph' },
  { id: 'bpi-gold',      name: 'BPI Gold Credit',       type: 'local_bank',    colors: { bg: 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)',         text: '#111111' }, logoUrl: 'https://logo.clearbit.com/bpi.com.ph' },
  { id: 'bpi-signature', name: 'BPI Visa Signature',    type: 'local_bank',    colors: { bg: 'linear-gradient(135deg, #1C1C1C 0%, #000000 100%)',         text: '#FFFFFF' }, logoUrl: 'https://logo.clearbit.com/bpi.com.ph' },

  // ── BDO ────────────────────────────────────────────────
  { id: 'bdo-debit',     name: 'BDO Debit Classic',     type: 'local_bank',    colors: { bg: '#002A54',                                                  text: '#FFFFFF' }, logoUrl: 'https://logo.clearbit.com/bdo.com.ph' },
  { id: 'bdo-emerald',   name: 'BDO Emerald Rewards',   type: 'local_bank',    colors: { bg: '#006B3F',                                                  text: '#FFFFFF' }, logoUrl: 'https://logo.clearbit.com/bdo.com.ph' },
  { id: 'bdo-gold',      name: 'BDO Gold Credit',       type: 'local_bank',    colors: { bg: '#C5A059',                                                  text: '#111111' }, logoUrl: 'https://logo.clearbit.com/bdo.com.ph' },
  { id: 'bdo-platinum',  name: 'BDO Platinum',          type: 'local_bank',    colors: { bg: 'linear-gradient(135deg, #7D7D7D 0%, #363636 100%)',         text: '#FFFFFF' }, logoUrl: 'https://logo.clearbit.com/bdo.com.ph' },

  // ── UnionBank ──────────────────────────────────────────
  { id: 'ub-debit',      name: 'UnionBank Debit',       type: 'local_bank',    colors: { bg: 'linear-gradient(135deg, #FF6600 0%, #FF6600 48%, #00205B 52%, #00205B 100%)', text: '#FFFFFF' }, logoUrl: 'https://logo.clearbit.com/unionbankph.com' },
  { id: 'ub-rewards',    name: 'UB Rewards Credit',     type: 'local_bank',    colors: { bg: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)',         text: '#FFFFFF' }, logoUrl: 'https://logo.clearbit.com/unionbankph.com' },
  { id: 'ub-miles',      name: 'UB Miles+ Credit',      type: 'local_bank',    colors: { bg: 'linear-gradient(135deg, #004D40 0%, #000000 100%)',         text: '#FFFFFF' }, logoUrl: 'https://logo.clearbit.com/unionbankph.com' },

  // ── Metrobank ──────────────────────────────────────────
  { id: 'metro-debit',   name: 'Metrobank Debit',       type: 'local_bank',    colors: { bg: '#0033A0',                                                  text: '#FFFFFF' }, logoUrl: 'https://logo.clearbit.com/metrobank.com.ph' },
  { id: 'metro-titan',   name: 'Metrobank Titanium',    type: 'local_bank',    colors: { bg: '#8C92AC',                                                  text: '#111111' }, logoUrl: 'https://logo.clearbit.com/metrobank.com.ph' },
  { id: 'metro-world',   name: 'Metrobank World',       type: 'local_bank',    colors: { bg: '#0A1128',                                                  text: '#D4AF37' }, logoUrl: 'https://logo.clearbit.com/metrobank.com.ph' },

  // ── RCBC ───────────────────────────────────────────────
  { id: 'rcbc-debit',    name: 'RCBC MyDebit',          type: 'local_bank',    colors: { bg: '#00205B',                                                  text: '#FFFFFF' }, logoUrl: 'https://logo.clearbit.com/rcbc.com' },
  { id: 'rcbc-hexagon',  name: 'RCBC Hexagon Club',     type: 'local_bank',    colors: { bg: '#001A11',                                                  text: '#D4AF37' }, logoUrl: 'https://logo.clearbit.com/rcbc.com' },
  { id: 'rcbc-flex',     name: 'RCBC Flex Visa',        type: 'local_bank',    colors: { bg: '#008C99',                                                  text: '#FFFFFF' }, logoUrl: 'https://logo.clearbit.com/rcbc.com' },

  // ── Security Bank ──────────────────────────────────────
  { id: 'secb-debit',    name: 'Security Bank Debit',   type: 'local_bank',    colors: { bg: 'linear-gradient(135deg, #007A33 0%, #004D20 100%)',         text: '#FFFFFF' }, logoUrl: 'https://logo.clearbit.com/securitybank.com' },
  { id: 'secb-wave',     name: 'Security Bank Wave',    type: 'local_bank',    colors: { bg: 'linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)',         text: '#FFFFFF' }, logoUrl: 'https://logo.clearbit.com/securitybank.com' },
  { id: 'secb-platinum', name: 'Security Bank Platinum',type: 'local_bank',    colors: { bg: '#A8A9AD',                                                  text: '#111111' }, logoUrl: 'https://logo.clearbit.com/securitybank.com' },

  // ── EastWest ───────────────────────────────────────────
  { id: 'ew-debit',      name: 'EastWest Debit',        type: 'local_bank',    colors: { bg: '#6A1B9A',                                                  text: '#FFFFFF' }, logoUrl: 'https://logo.clearbit.com/eastwestbanker.com' },
  { id: 'ew-platinum',   name: 'EastWest Platinum',     type: 'local_bank',    colors: { bg: '#1C1C1C',                                                  text: '#FFFFFF' }, logoUrl: 'https://logo.clearbit.com/eastwestbanker.com' },

  // ── Landbank ───────────────────────────────────────────
  { id: 'landbank',      name: 'Landbank Visa',         type: 'local_bank',    colors: { bg: '#006400',                                                  text: '#FFFFFF' }, logoUrl: 'https://logo.clearbit.com/landbank.com' },

  // ── International & Freelance ──────────────────────────
  { id: 'wise',          name: 'Wise',                  type: 'international', colors: { bg: '#9FE870',                                                  text: '#163300' }, logoUrl: 'https://logo.clearbit.com/wise.com' },
  { id: 'paypal',        name: 'PayPal',                type: 'international', colors: { bg: 'linear-gradient(135deg, #003087 0%, #0079C1 100%)',         text: '#FFFFFF' }, logoUrl: 'https://logo.clearbit.com/paypal.com' },
  { id: 'payoneer',      name: 'Payoneer',              type: 'international', colors: { bg: '#FF5D00',                                                  text: '#FFFFFF' }, logoUrl: 'https://logo.clearbit.com/payoneer.com' },
  { id: 'deel',          name: 'Deel',                  type: 'international', colors: { bg: '#15357A',                                                  text: '#FFFFFF' }, logoUrl: 'https://logo.clearbit.com/deel.com' },

  // ── Generic ────────────────────────────────────────────
  { id: 'generic-cash',  name: 'Cash',                  type: 'generic',       colors: { bg: 'linear-gradient(135deg, #5C7A4E 0%, #3D5235 100%)',         text: '#FFFFFF' }, logoUrl: null },
  { id: 'generic-dark',  name: 'Dark Card',             type: 'generic',       colors: { bg: '#2D3748',                                                  text: '#FFFFFF' }, logoUrl: null },
  { id: 'generic-rose',  name: 'Rose',                  type: 'generic',       colors: { bg: 'linear-gradient(135deg, #D4788E 0%, #A84E64 100%)',         text: '#FFFFFF' }, logoUrl: null },
  { id: 'generic-gold',  name: 'Gold',                  type: 'generic',       colors: { bg: 'linear-gradient(135deg, #D4A84B 0%, #A07820 100%)',         text: '#FFFFFF' }, logoUrl: null },
  { id: 'generic-navy',  name: 'Navy',                  type: 'generic',       colors: { bg: 'linear-gradient(135deg, #2D3561 0%, #1A2040 100%)',         text: '#FFFFFF' }, logoUrl: null },
  { id: 'generic-light', name: 'Light Card',            type: 'generic',       colors: { bg: '#EDF2F7',                                                  text: '#1A202C' }, logoUrl: null },
]

export const SKIN_CATEGORIES = [
  { id: 'ewallet',       label: 'E-Wallets & Digital Banks' },
  { id: 'local_bank',    label: 'Local Banks' },
  { id: 'international', label: 'International & Freelance' },
  { id: 'generic',       label: 'Generic' },
]

/**
 * Look up a skin by id. Falls back to generic-dark if not found.
 * @param {string | null | undefined} skinId
 * @returns {CardSkin}
 */
export function getSkin(skinId) {
  return CARD_SKINS.find((s) => s.id === skinId)
    ?? CARD_SKINS.find((s) => s.id === 'generic-dark')
}
