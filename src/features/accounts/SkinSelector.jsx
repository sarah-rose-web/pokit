import { CARD_SKINS, SKIN_CATEGORIES } from '@/config/cardSkins'
import './SkinSelector.css'

/**
 * @param {{
 *   value:    string | null,
 *   onChange: (skinId: string) => void,
 * }} props
 */
export default function SkinSelector({ value, onChange }) {
  return (
    <div className="skin-selector">
      {SKIN_CATEGORIES.map((cat) => {
        const skins = CARD_SKINS.filter((s) => s.category === cat.id)
        return (
          <div key={cat.id} className="skin-selector__group">
            <p className="skin-selector__group-label">{cat.label}</p>
            <div className="skin-selector__grid">
              {skins.map((skin) => (
                <button
                  key={skin.id}
                  type="button"
                  className={`skin-swatch${value === skin.id ? ' skin-swatch--active' : ''}`}
                  style={{ background: skin.bg }}
                  onClick={() => onChange(skin.id)}
                  aria-label={skin.name}
                  title={skin.name}
                >
                  <span className="skin-swatch__name">{skin.name}</span>
                  {value === skin.id && (
                    <span className="skin-swatch__check" aria-hidden="true">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
