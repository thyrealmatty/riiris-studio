import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Badge from '../ui/Badge'
import FavoriteButton from '../music/FavoriteButton'
import { usePlayer } from '../../context/PlayerContext'

// Horizontal-scroll style card (used in New Releases, Popular, etc.)
export default function SongCard({ song, contextIds }) {
  const { playSong, currentSong, isPlaying } = usePlayer()
  const navigate = useNavigate()
  const isCurrent = currentSong?.id === song.id

  const handleClick = () => {
    if (!song.hasAudio) return navigate(`/song/${song.id}`)
    playSong(song.id, contextIds)
  }

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={handleClick}
      className="w-[150px] shrink-0 text-left group"
    >
      <div className="relative rounded-card overflow-hidden glass-edge mb-2">
        <img src={song.artwork} alt={song.title} loading="lazy" className="w-full aspect-square object-cover" />
        {song.newRelease ? (
          <Badge label="NEW" className="absolute top-2 left-2" />
        ) : (
          !song.hasAudio && <Badge label="SOON" className="absolute top-2 left-2" />
        )}
        {isCurrent && isPlaying && <Badge label="PLAYING" className="absolute top-2 right-2" />}
        <div className="absolute inset-0 bg-br-ink/0 group-hover:bg-br-ink/10 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-3 shadow-lg">
            <Play size={18} className="fill-br-ink text-br-ink" />
          </span>
        </div>
      </div>
      <div className="flex items-start justify-between gap-1 px-0.5">
        <div className="min-w-0">
          <p className="font-display font-bold text-sm truncate text-br-ink dark:text-white">{song.title}</p>
          <p className="text-xs text-br-ink/50 dark:text-white/50 truncate">{song.artist}</p>
        </div>
        <FavoriteButton songId={song.id} size={16} className="mt-0.5 shrink-0" />
      </div>
    </motion.button>
  )
}
