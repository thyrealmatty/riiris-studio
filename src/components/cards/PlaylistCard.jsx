import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useContent } from '../../context/ContentContext'

const ACCENTS = ['bg-br-pink-light', 'bg-br-blue-light', 'bg-br-purple-light']

export default function PlaylistCard({ playlist, index = 0 }) {
  const { getSong } = useContent()
  const previewSongs = (playlist.songIds || []).slice(0, 3).map(getSong).filter(Boolean)
  const accent = ACCENTS[index % ACCENTS.length]

  return (
    <motion.div whileTap={{ scale: 0.97 }} className="w-[230px] shrink-0">
      <Link
        to={`/playlist/${playlist.id}`}
        className={`block rounded-card glass-edge overflow-hidden ${accent}`}
      >
        <div className="p-4 pb-3">
          <p className="text-[11px] font-display font-bold tracking-wide text-br-ink/50 uppercase">Playlist</p>
          <h3 className="font-display font-extrabold text-lg text-br-ink leading-tight mt-0.5">{playlist.title}</h3>
        </div>
        <div className="bg-white/70 dark:bg-br-dark/40 rounded-t-card px-4 pt-3 pb-4 space-y-2">
          {previewSongs.length ? (
            previewSongs.map((song) => (
              <div key={song.id} className="flex items-center gap-2">
                <img src={song.artwork} alt="" className="w-8 h-8 rounded-lg object-cover border border-br-ink/10" />
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate text-br-ink">{song.title}</p>
                  <p className="text-[10px] text-br-ink/50 truncate">{song.artist}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-br-ink/40 italic">No songs added yet</p>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
