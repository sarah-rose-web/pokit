import { getSkin }          from '@/config/cardSkins'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'

const TYPE_LABEL = {
  cash:    'Cash',
  bank:    'Bank',
  ewallet: 'E-Wallet',
  credit:  'Credit',
}

/**
 * Compact wallet tile for the 2-column tile grid view.
 * Shows: logo icon, balance, account name, type label.
 *
 * @param {{
 *   account:  import('@/store/accountsStore').Account,
 *   onSelect: (account: import('@/store/accountsStore').Account) => void,
 * }} props
 */
export default function WalletTile({ account, onSelect }) {
  const { format } = useFormatCurrency()
  const skin       = getSkin(account.skinId)

  return (
    <div
      className="wallet-tile"
      onClick={() => onSelect(account)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(account)}
      aria-label={`${account.name} — ${format(account.balance ?? 0)}`}
    >
      {/* Icon box */}
      <div className="wallet-tile__icon" style={{ background: skin.colors.bg }}>
        {skin.logoUrl ? (
          <img
            src={skin.logoUrl}
            alt={skin.name}
            className="wallet-tile__logo"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <span className="wallet-tile__icon-fallback">
            {account.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Balance */}
      <p className="wallet-tile__balance">{format(account.balance ?? 0)}</p>

      {/* Name + type */}
      <p className="wallet-tile__name">{account.name}</p>
      <p className="wallet-tile__type">{TYPE_LABEL[account.type] ?? account.type}</p>
    </div>
  )
}
