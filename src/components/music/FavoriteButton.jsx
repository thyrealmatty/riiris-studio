import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useContent } from '../../context/ContentContext'

export default function FavoriteButton({ songId, size = 20, className = '' }) {
  const { isFavorite, toggleFavorite } = useContent()
  const active = isFavorite(songId)

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.8 }}
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        toggleFavorite(songId)
      }}
      aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={active}
      className={`inline-flex items-center justify-center rounded-full transition-colors ${className}`}
    >
      <motion.span
        key={active ? 'on' : 'off'}
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      >
        <Heart
          size={size}
          className={active ? 'fill-br-pink text-br-pink' : 'text-br-ink/40 dark:text-white/40'}
        />
      </motion.span>
    </motion.button>
  )
}
