import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function AlbumCard({ album, wide = false }) {
  return (
    <motion.div whileTap={{ scale: 0.97 }} className={wide ? 'w-full' : 'w-[150px] shrink-0'}>
      <Link to={`/album/${album.id}`} className="block group">
        <div className="rounded-card overflow-hidden glass-edge mb-2">
          <img src={album.artwork} alt={album.title} className="w-full aspect-square object-cover" />
        </div>
        <p className="font-display font-bold text-sm truncate text-br-ink dark:text-white px-0.5">{album.title}</p>
        <p className="text-xs text-br-ink/50 dark:text-white/50 truncate px-0.5">
          {album.artist} · {album.songIds?.length || 0} songs
        </p>
      </Link>
    </motion.div>
  )
}
