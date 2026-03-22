/**
 * Pokkie — Pokit's mascot. Chubby pink piggy bank.
 * Solid silhouette only. Expression from white ring eyes.
 * Never below 48px. Never cropped.
 *
 * @param {{ size?: number, expression?: 'neutral'|'happy'|'thinking'|'surprised', className?: string }} props
 */
export default function Pokkie({ size = 80, expression = 'neutral', className = '' }) {
  // Eye offsets by expression
  const eyeConfig = {
    neutral:   { ry: 5, eyeY: 46 },
    happy:     { ry: 3, eyeY: 48 },    // squinted happy
    thinking:  { ry: 5, eyeY: 46 },
    surprised: { ry: 7, eyeY: 44 },    // wide
  }

  const { ry, eyeY } = eyeConfig[expression] ?? eyeConfig.neutral

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Pokkie the piggy bank"
      role="img"
      className={className}
    >
      {/* Body */}
      <ellipse cx="60" cy="72" rx="44" ry="38" fill="#F2A0B4" />

      {/* Head */}
      <circle cx="60" cy="48" r="30" fill="#F2A0B4" />

      {/* Ears */}
      <ellipse cx="33" cy="26" rx="10" ry="13" fill="#F2A0B4" />
      <ellipse cx="87" cy="26" rx="10" ry="13" fill="#F2A0B4" />
      {/* Inner ears */}
      <ellipse cx="33" cy="27" rx="5" ry="7" fill="#E8899E" />
      <ellipse cx="87" cy="27" rx="5" ry="7" fill="#E8899E" />

      {/* Snout */}
      <ellipse cx="60" cy="58" rx="14" ry="10" fill="#E8899E" />
      {/* Nostrils */}
      <circle cx="55" cy="58" r="2.5" fill="#D4788E" />
      <circle cx="65" cy="58" r="2.5" fill="#D4788E" />

      {/* Eyes — white ring style, expression via ry */}
      <circle cx="46" cy={eyeY} r="8" fill="white" />
      <circle cx="74" cy={eyeY} r="8" fill="white" />
      <ellipse cx="46" cy={eyeY} rx="4" ry={ry} fill="#2D1F2D" />
      <ellipse cx="74" cy={eyeY} rx="4" ry={ry} fill="#2D1F2D" />
      {/* Eye shine */}
      <circle cx="48" cy={eyeY - 2} r="1.5" fill="white" />
      <circle cx="76" cy={eyeY - 2} r="1.5" fill="white" />

      {/* Thinking eyebrow */}
      {expression === 'thinking' && (
        <path d="M40 36 Q46 33 52 36" stroke="#D4788E" strokeWidth="2" strokeLinecap="round" />
      )}

      {/* Coin slot on top of head */}
      <rect x="54" y="18" width="12" height="3" rx="1.5" fill="#D4788E" />

      {/* Legs */}
      <ellipse cx="38" cy="106" rx="10" ry="7" fill="#F2A0B4" />
      <ellipse cx="82" cy="106" rx="10" ry="7" fill="#F2A0B4" />
      <ellipse cx="50" cy="108" rx="9"  ry="6" fill="#F2A0B4" />
      <ellipse cx="70" cy="108" rx="9"  ry="6" fill="#F2A0B4" />

      {/* Tail — small curly spiral */}
      <path
        d="M104 72 Q112 65 108 58 Q104 52 98 56"
        stroke="#F2A0B4"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
