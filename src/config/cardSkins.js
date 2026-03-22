/**
 * cardSkins.js
 * Real card variants for PH banks, e-wallets, and international platforms.
 *
 * HOW CARD ART WORKS:
 * ─────────────────────────────────────────────────────────────────────
 * Each skin has an optional `bgImage` pointing to a file in /public/card-art/.
 * When the file exists, it is used as the full card background (cover).
 * When it is missing or null, the card falls back to `colors.bg` (CSS color or gradient).
 *
 * TO ADD YOUR REAL CARD PHOTOS:
 *   1. Take a straight-on, well-lit photo of the physical card (landscape orientation).
 *   2. Crop to exactly 1000 × 630 px (landscape credit card ratio, ~1.586:1, doubled for retina).
 *      Your photos are 1000 × 1568 px portrait — rotate/crop them to landscape before dropping in.
 *   3. Export as PNG and drop into /public/card-art/{id}.png  — e.g. bdo-gold.png
 *   4. The card will automatically switch to the photo the next time you reload.
 *
 * You do NOT need to change any code — just drop the file in and it works.
 * ─────────────────────────────────────────────────────────────────────
 *
 * @typedef {{
 *   id:       string,
 *   name:     string,
 *   type:     string,
 *   baseType: 'cash' | 'bank' | 'ewallet' | 'credit',
 *   bgImage:  string | null,   — path to /public/card-art/{id}.png, or null for CSS-only
 *   colors:   { bg: string, text: string },  — bg is the CSS fallback when no bgImage
 *   logoUrl:  string | null,   — still used in WalletTile + SkinSelector previews
 * }} CardSkin
 */

const L  = (file) => `/bank-logos/${file}.svg`
const CA = (id)   => `/card-art/${id}.png`

/** @type {CardSkin[]} */
export const CARD_SKINS = [
  // ── E-wallets & Digital Banks ──────────────────────────
  // Drop your card photo at /public/card-art/gcash.png to activate
  { id: 'gcash',         name: 'GCash Mastercard',       type: 'ewallet',       baseType: 'ewallet',  bgImage: CA('gcash'),         colors: { bg: '#007DFE',                                                           text: '#FFFFFF' }, logoUrl: L('gcash') },
  { id: 'maya-dark',     name: 'Maya Card (Black)',       type: 'ewallet',       baseType: 'ewallet',  bgImage: CA('maya-dark'),     colors: { bg: '#111111',                                                           text: '#00E570' }, logoUrl: L('maya') },
  { id: 'maya-green',    name: 'Maya Card (Green)',       type: 'ewallet',       baseType: 'ewallet',  bgImage: CA('maya-green'),    colors: { bg: '#00E570',                                                           text: '#111111' }, logoUrl: L('maya') },
  { id: 'gotyme',        name: 'GoTyme Visa',             type: 'ewallet',       baseType: 'ewallet',  bgImage: CA('gotyme'),        colors: { bg: 'linear-gradient(135deg, #00D1FF 0%, #0047FF 100%)',                  text: '#FFFFFF' }, logoUrl: L('gotyme') },
  { id: 'seabank',       name: 'SeaBank Debit',           type: 'ewallet',       baseType: 'ewallet',  bgImage: CA('seabank'),       colors: { bg: '#FF6B00',                                                           text: '#FFFFFF' }, logoUrl: L('seabank') },
  { id: 'tonik',         name: 'Tonik Stash',             type: 'ewallet',       baseType: 'ewallet',  bgImage: CA('tonik'),         colors: { bg: '#5A2E8A',                                                           text: '#FFCC00' }, logoUrl: L('tonik') },

  // ── BPI ────────────────────────────────────────────────
  { id: 'bpi-debit',     name: 'BPI Debit Classic',      type: 'local_bank',    baseType: 'bank',     bgImage: CA('bpi-debit'),     colors: { bg: '#B22222',                                                           text: '#FFFFFF' }, logoUrl: L('bpi') },
  { id: 'bpi-blue',      name: 'BPI Blue Credit',        type: 'local_bank',    baseType: 'credit',   bgImage: CA('bpi-blue'),      colors: { bg: '#003087',                                                           text: '#FFFFFF' }, logoUrl: L('bpi') },
  { id: 'bpi-gold',      name: 'BPI Gold Credit',        type: 'local_bank',    baseType: 'credit',   bgImage: CA('bpi-gold'),      colors: { bg: 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)',                  text: '#111111' }, logoUrl: L('bpi') },
  { id: 'bpi-signature', name: 'BPI Visa Signature',     type: 'local_bank',    baseType: 'credit',   bgImage: CA('bpi-signature'), colors: { bg: 'linear-gradient(135deg, #1C1C1C 0%, #000000 100%)',                  text: '#FFFFFF' }, logoUrl: L('bpi') },

  // ── BDO ────────────────────────────────────────────────
  { id: 'bdo-debit',     name: 'BDO Debit Classic',      type: 'local_bank',    baseType: 'bank',     bgImage: CA('bdo-debit'),     colors: { bg: '#002A54',                                                           text: '#FFFFFF' }, logoUrl: L('bdo') },
  { id: 'bdo-emerald',   name: 'BDO Emerald Rewards',    type: 'local_bank',    baseType: 'credit',   bgImage: CA('bdo-emerald'),   colors: { bg: '#006B3F',                                                           text: '#FFFFFF' }, logoUrl: L('bdo') },
  { id: 'bdo-gold',      name: 'BDO Gold Credit',        type: 'local_bank',    baseType: 'credit',   bgImage: CA('bdo-gold'),      colors: { bg: '#C5A059',                                                           text: '#111111' }, logoUrl: L('bdo') },
  { id: 'bdo-platinum',  name: 'BDO Platinum',           type: 'local_bank',    baseType: 'credit',   bgImage: CA('bdo-platinum'),  colors: { bg: 'linear-gradient(135deg, #7D7D7D 0%, #363636 100%)',                  text: '#FFFFFF' }, logoUrl: L('bdo') },

  // ── UnionBank ──────────────────────────────────────────
  { id: 'ub-debit',      name: 'UnionBank Debit',        type: 'local_bank',    baseType: 'bank',     bgImage: CA('ub-debit'),      colors: { bg: 'linear-gradient(135deg, #FF6600 0%, #FF6600 48%, #00205B 52%, #00205B 100%)', text: '#FFFFFF' }, logoUrl: L('unionbank') },
  { id: 'ub-rewards',    name: 'UB Rewards Credit',      type: 'local_bank',    baseType: 'credit',   bgImage: CA('ub-rewards'),    colors: { bg: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)',                  text: '#FFFFFF' }, logoUrl: L('unionbank') },
  { id: 'ub-miles',      name: 'UB Miles+ Credit',       type: 'local_bank',    baseType: 'credit',   bgImage: CA('ub-miles'),      colors: { bg: 'linear-gradient(135deg, #004D40 0%, #000000 100%)',                  text: '#FFFFFF' }, logoUrl: L('unionbank') },

  // ── Metrobank ──────────────────────────────────────────
  { id: 'metro-debit',   name: 'Metrobank Debit',        type: 'local_bank',    baseType: 'bank',     bgImage: CA('metro-debit'),   colors: { bg: '#0033A0',                                                           text: '#FFFFFF' }, logoUrl: L('metrobank') },
  { id: 'metro-titan',   name: 'Metrobank Titanium',     type: 'local_bank',    baseType: 'credit',   bgImage: CA('metro-titan'),   colors: { bg: '#8C92AC',                                                           text: '#111111' }, logoUrl: L('metrobank') },
  { id: 'metro-world',   name: 'Metrobank World',        type: 'local_bank',    baseType: 'credit',   bgImage: CA('metro-world'),   colors: { bg: '#0A1128',                                                           text: '#D4AF37' }, logoUrl: L('metrobank') },

  // ── RCBC ───────────────────────────────────────────────
  { id: 'rcbc-debit',    name: 'RCBC MyDebit',           type: 'local_bank',    baseType: 'bank',     bgImage: CA('rcbc-debit'),    colors: { bg: '#00205B',                                                           text: '#FFFFFF' }, logoUrl: L('rcbc') },
  { id: 'rcbc-hexagon',  name: 'RCBC Hexagon Club',      type: 'local_bank',    baseType: 'credit',   bgImage: CA('rcbc-hexagon'),  colors: { bg: '#001A11',                                                           text: '#D4AF37' }, logoUrl: L('rcbc') },
  { id: 'rcbc-flex',     name: 'RCBC Flex Visa',         type: 'local_bank',    baseType: 'credit',   bgImage: CA('rcbc-flex'),     colors: { bg: '#008C99',                                                           text: '#FFFFFF' }, logoUrl: L('rcbc') },

  // ── Security Bank ──────────────────────────────────────
  { id: 'secb-debit',    name: 'Security Bank Debit',    type: 'local_bank',    baseType: 'bank',     bgImage: CA('secb-debit'),    colors: { bg: 'linear-gradient(135deg, #007A33 0%, #004D20 100%)',                  text: '#FFFFFF' }, logoUrl: L('securitybank') },
  { id: 'secb-wave',     name: 'Security Bank Wave',     type: 'local_bank',    baseType: 'credit',   bgImage: CA('secb-wave'),     colors: { bg: 'linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)',                  text: '#FFFFFF' }, logoUrl: L('securitybank') },
  { id: 'secb-platinum', name: 'Security Bank Platinum', type: 'local_bank',    baseType: 'credit',   bgImage: CA('secb-platinum'), colors: { bg: '#A8A9AD',                                                           text: '#111111' }, logoUrl: L('securitybank') },

  // ── EastWest ───────────────────────────────────────────
  { id: 'ew-debit',      name: 'EastWest Debit',         type: 'local_bank',    baseType: 'bank',     bgImage: CA('ew-debit'),      colors: { bg: '#6A1B9A',                                                           text: '#FFFFFF' }, logoUrl: L('eastwest') },
  { id: 'ew-platinum',   name: 'EastWest Platinum',      type: 'local_bank',    baseType: 'credit',   bgImage: CA('ew-platinum'),   colors: { bg: '#1C1C1C',                                                           text: '#FFFFFF' }, logoUrl: L('eastwest') },

  // ── Landbank ───────────────────────────────────────────
  { id: 'landbank',      name: 'Landbank Visa',          type: 'local_bank',    baseType: 'bank',     bgImage: CA('landbank'),      colors: { bg: '#006400',                                                           text: '#FFFFFF' }, logoUrl: L('landbank') },

  // ── International & Freelance ──────────────────────────
  { id: 'wise',          name: 'Wise',                   type: 'international', baseType: 'ewallet',  bgImage: CA('wise'),          colors: { bg: '#9FE870',                                                           text: '#163300' }, logoUrl: L('wise') },
  { id: 'paypal',        name: 'PayPal',                 type: 'international', baseType: 'ewallet',  bgImage: CA('paypal'),        colors: { bg: 'linear-gradient(135deg, #003087 0%, #0079C1 100%)',                  text: '#FFFFFF' }, logoUrl: L('paypal') },
  { id: 'payoneer',      name: 'Payoneer',               type: 'international', baseType: 'ewallet',  bgImage: CA('payoneer'),      colors: { bg: '#FF5D00',                                                           text: '#FFFFFF' }, logoUrl: L('payoneer') },
  { id: 'deel',          name: 'Deel',                   type: 'international', baseType: 'ewallet',  bgImage: CA('deel'),          colors: { bg: '#15357A',                                                           text: '#FFFFFF' }, logoUrl: L('deel') },
  { id: 'shoppepay',     name: 'ShopeePay',              type: 'ewallet',       baseType: 'ewallet',  bgImage: CA('shoppepay'),     colors: { bg: 'linear-gradient(135deg, #EE4D2D 0%, #CC3010 100%)',                  text: '#FFFFFF' }, logoUrl: L('shoppepay') },
  { id: 'grabpay',       name: 'GrabPay',                type: 'ewallet',       baseType: 'ewallet',  bgImage: CA('grabpay'),       colors: { bg: 'linear-gradient(135deg, #00B14F 0%, #007A36 100%)',                  text: '#FFFFFF' }, logoUrl: L('grabpay') },
  { id: 'coins',         name: 'Coins.ph',               type: 'ewallet',       baseType: 'ewallet',  bgImage: CA('coins'),         colors: { bg: 'linear-gradient(135deg, #6B21A8 0%, #4C1778 100%)',                  text: '#FFFFFF' }, logoUrl: L('coins') },

  // ── Generic — intentional CSS cards, no bgImage ────────
  { id: 'generic-cash',  name: 'Cash',                   type: 'generic',       baseType: 'cash',     bgImage: null,                colors: { bg: 'linear-gradient(135deg, #5C7A4E 0%, #3D5235 100%)',                  text: '#FFFFFF' }, logoUrl: null },
  { id: 'generic-dark',  name: 'Dark Card',              type: 'generic',       baseType: 'bank',     bgImage: null,                colors: { bg: '#2D3748',                                                           text: '#FFFFFF' }, logoUrl: null },
  { id: 'generic-rose',  name: 'Rose',                   type: 'generic',       baseType: 'bank',     bgImage: null,                colors: { bg: 'linear-gradient(135deg, #D4788E 0%, #A84E64 100%)',                  text: '#FFFFFF' }, logoUrl: null },
  { id: 'generic-gold',  name: 'Gold',                   type: 'generic',       baseType: 'bank',     bgImage: null,                colors: { bg: 'linear-gradient(135deg, #D4A84B 0%, #A07820 100%)',                  text: '#FFFFFF' }, logoUrl: null },
  { id: 'generic-navy',  name: 'Navy',                   type: 'generic',       baseType: 'bank',     bgImage: null,                colors: { bg: 'linear-gradient(135deg, #2D3561 0%, #1A2040 100%)',                  text: '#FFFFFF' }, logoUrl: null },
  { id: 'generic-light', name: 'Light Card',             type: 'generic',       baseType: 'bank',     bgImage: null,                colors: { bg: '#EDF2F7',                                                           text: '#1A202C' }, logoUrl: null },
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
