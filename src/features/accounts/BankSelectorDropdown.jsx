import { useState } from 'react'
import { CARD_SKINS, SKIN_CATEGORIES, getSkin } from '@/config/cardSkins'
import './BankSelectorDropdown.css'

/**
 * Custom bank/skin selector dropdown.
 * Selecting an item sets the skinId AND auto-fills the account name.
 *
 * @param {{
 *   skinId:   string | null,
 *   onSelect: (skinId: string, name: string) => void,
 * }} props
 */
export default function BankSelectorDropdown({ skinId, onSelect }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const selected = skinId ? getSkin(skinId) : null

  const filtered = query.trim()
    ? CARD_SKINS.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
    : null

  function handleSelect(skin) {
    onSelect(skin.id, skin.name)
    setOpen(false)
    setQuery('')
  }

  return (
    <div className="bsd">
      {/* Trigger */}
      <button
        type="button"
        className={`bsd__trigger${open ? ' bsd__trigger--open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {selected ? (
          <div className="bsd__selected">
            <span
              className="bsd__swatch"
              style={{ background: selected.colors.bg }}
            />
            {selected.logoUrl && (
              <img
                src={selected.logoUrl}
                alt={selected.name}
                className="bsd__logo"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            )}
            <span className="bsd__selected-name">{selected.name}</span>
          </div>
        ) : (
          <span className="bsd__placeholder">Select your Bank / E-Wallet</span>
        )}
        <svg
          className={`bsd__chevron${open ? ' bsd__chevron--up' : ''}`}
          width="16" height="16" viewBox="0 0 16 16"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        >
          <path d="M4 6l4 4 4-4"/>
        </svg>
      </button>

      {/* Panel */}
      {open && (
        <div className="bsd__panel">
          {/* Search */}
          <div className="bsd__search-wrap">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <circle cx="6" cy="6" r="4"/>
              <path d="M9.5 9.5l2.5 2.5"/>
            </svg>
            <input
              className="bsd__search"
              placeholder="Search bank or wallet…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          <div className="bsd__list">
            {filtered ? (
              filtered.length === 0 ? (
                <p className="bsd__empty">No results for "{query}"</p>
              ) : (
                filtered.map((skin) => (
                  <BankOption key={skin.id} skin={skin} selected={skinId === skin.id} onSelect={handleSelect} />
                ))
              )
            ) : (
              SKIN_CATEGORIES.map((cat) => {
                const items = CARD_SKINS.filter((s) => s.type === cat.id)
                return (
                  <div key={cat.id} className="bsd__group">
                    <p className="bsd__group-label">{cat.label}</p>
                    {items.map((skin) => (
                      <BankOption key={skin.id} skin={skin} selected={skinId === skin.id} onSelect={handleSelect} />
                    ))}
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function BankOption({ skin, selected, onSelect }) {
  return (
    <button
      type="button"
      className={`bsd__option${selected ? ' bsd__option--selected' : ''}`}
      onClick={() => onSelect(skin)}
    >
      <span className="bsd__option-swatch" style={{ background: skin.colors.bg }} />
      {skin.logoUrl && (
        <img
          src={skin.logoUrl}
          alt={skin.name}
          className="bsd__option-logo"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
      )}
      <span className="bsd__option-name">{skin.name}</span>
      {selected && (
        <svg className="bsd__option-check" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M2.5 7l3.5 3.5 5.5-6"/>
        </svg>
      )}
    </button>
  )
}
