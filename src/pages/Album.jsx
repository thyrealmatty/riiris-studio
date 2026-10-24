import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Shuffle } from 'lucide-react'
import { useContent } from '../context/ContentContext'
import { usePlayer } from '../context/PlayerContext'
import SongRow from '../components/music/SongRow'
import EmptyState from '../components/ui/EmptyState'
import { formatDuration, totalDuration, shuffled } from '../utils/format'

export default function Album() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getAlbum, getSong } = useContent()
  const { playQueue } = usePlayer()

  const album = getAlbum(id)
  if (!album) {
    return (
      <div className="pb-6">
        <div className="px-5 pt-6"><button onClick={() => navigate(-1)}><ArrowLeft /></button></div>
        <EmptyState title="Album not found" />
      </div>
    )
  }

  const albumSongs = (album.songIds || []).map(getSong).filter(Boolean)

  return (
    <div className="pb-10">
      <div className="px-5 pt-6 pb-2">
        <button onClick={() => navigate(-1)} aria-label="Back" className="p-1 -ml-1">
          <ArrowLeft size={22} className="text-br-ink dark:text-white" />
        </button>
      </div>

      <div className="px-6 flex flex-col items-center text-center mt-2">
        <div className="w-48 h-48 rounded-card overflow-hidden glass-edge">
          <img src={album.artwork} alt={album.title} className="w-full h-full object-cover" />
        </div>
        <h1 className="font-display text-2xl font-extrabold text-br-ink dark:text-white mt-4">{album.title}</h1>
        <p className="text-sm font-semibold text-br-ink/50 dark:text-white/50 mt-1">
          {album.artist} · {albumSongs.length} songs · {formatDuration(totalDuration(albumSongs))}
        </p>
        {album.description && (
          <p className="text-sm text-br-ink/60 dark:text-white/60 mt-3 max-w-sm">{album.description}</p>
        )}

        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={() => playQueue(albumSongs.map((s) => s.id))}
            disabled={!albumSongs.length}
            className="flex items-center gap-2 bg-br-purple text-white font-display font-bold px-6 py-2.5 rounded-pill shadow-soft active:scale-95 transition-transform disabled:opacity-40"
          >
            <Play size={16} fill="currentColor" /> Play All
          </button>
          <button
            onClick={() => {
              playQueue(shuffled(albumSongs).map((s) => s.id))
            }}
            disabled={!albumSongs.length}
            className="flex items-center gap-2 bg-br-purple-light text-br-purple-dark font-display font-bold px-6 py-2.5 rounded-pill active:scale-95 transition-transform disabled:opacity-40"
          >
            <Shuffle size={16} /> Shuffle
          </button>
        </div>
      </div>

      <div className="mt-8 px-3">
        {albumSongs.length ? (
          <div className="space-y-1">
            {albumSongs.map((song, i) => (
              <SongRow key={song.id} song={song} index={i + 1} contextIds={albumSongs.map((s) => s.id)} showAlbumArt={false} />
            ))}
          </div>
        ) : (
          <EmptyState title="No songs in this album yet" />
        )}
      </div>
    </div>
  )
}
