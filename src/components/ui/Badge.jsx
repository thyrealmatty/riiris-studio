const VARIANTS = {
  NEW: 'bg-br-blue text-br-ink',
  FEATURED: 'bg-br-purple text-white',
  TRENDING: 'bg-br-pink text-br-ink',
  PLAYING: 'bg-br-purple-light text-br-purple-dark',
  SOON: 'bg-br-blue-light text-br-ink/70',
  FAV: 'bg-br-pink-light text-pink-600'
}

export default function Badge({ label, className = '' }) {
  if (!label) return null
  const style = VARIANTS[label.toUpperCase()] || 'bg-br-purple-light text-br-purple-dark'
  return (
    <span
      className={`inline-flex items-center rounded-pill border border-br-ink/10 px-2.5 py-1 text-[11px] font-display font-bold tracking-wide -rotate-2 shadow-sm ${style} ${className}`}
    >
      {label.toUpperCase()}
    </span>
  )
}
