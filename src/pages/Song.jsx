import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Play, Pause, ListPlus, ListEnd, Clock } from 'lucide-react'
import { useContent } from '../context/ContentContext'
import { usePlayer } from '../context/PlayerContext'
import FavoriteButton from '../components/music/FavoriteButton'
import ShareButton from '../components/ui/ShareButton'
import SectionHeader from '../components/ui/SectionHeader'
import SongRow from '../components/music/SongRow'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import { formatDuration, formatDate } from '../utils/format'

export default function Song() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getSong, getAlbum } = useContent()
  const { playSong, currentSong, isPlaying, toggle, playNext, addToQueue } = usePlayer()

  const song = getSong(id)
  if (!song) {
    return (
      <div className="pb-6">
        <div className="px-5 pt-6">
          <button onClick={() => navigate(-1)} aria-label="Back">
            <ArrowLeft />
          </button>
        </div>
        <EmptyState title="Song not found" subtitle="It may have been removed." />
      </div>
    )
  }

  const isCurrent = currentSong?.id === song.id
  const album = song.album ? getAlbum(song.album) : null
  const albumMates = album ? album.songIds.filter((sid) => sid !== song.id).map(getSong).filter(Boolean) : []

  return (
    <div className="pb-10">
      <div className="flex items-center justify-between px-5 pt-6 pb-2">
        <button onClick={() => navigate(-1)} aria-label="Back" className="p-1 -ml-1">
          <ArrowLeft size={22} className="text-br-ink dark:text-white" />
        </button>
        <div className="flex items-center gap-2">
          <ShareButton title={song.title} text={`Listen to ${song.title} by ${song.artist}`} path={`/song/${song.id}`} size={22} />
          <FavoriteButton songId={song.id} size={22} />
        </div>
      </div>

      <div className="px-8 mt-4">
        <div className="rounded-card overflow-hidden border-4 border-br-ink/10 shadow-soft">
          <img src={song.artwork} alt={song.title} className="w-full aspect-square object-cover" />
        </div>
      </div>

      <div className="px-6 mt-6 text-center">
        <div className="flex items-center justify-center gap-2">
          <h1 className="font-display text-2xl font-extrabold text-br-ink dark:text-white">{song.title}</h1>
          {song.newRelease && <Badge label="NEW" />}
        </div>
        <p className="text-sm font-semibold text-br-ink/50 dark:text-white/50 mt-1">
          {song.artist}
          {song.featuredArtists?.length ? ` feat. ${song.featuredArtists.join(', ')}` : ''}
        </p>

        {song.hasAudio ? (
          <>
            <button
              onClick={() => (isCurrent ? toggle() : playSong(song.id, [song.id, ...albumMates.map((s) => s.id)]))}
              className="mt-6 inline-flex items-center gap-2 bg-br-purple text-white font-display font-bold px-8 py-3 rounded-pill shadow-soft active:scale-95 transition-transform"
            >
              {isCurrent && isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
              {isCurrent && isPlaying ? 'Pause' : 'Play'}
            </button>
            <div className="flex items-center justify-center gap-3 mt-3">
              <button
                onClick={() => playNext(song.id)}
                className="inline-flex items-center gap-1.5 bg-br-purple-light text-br-purple-dark font-display font-bold text-xs px-4 py-2 rounded-pill active:scale-95 transition-transform"
              >
                <ListPlus size={14} /> Play next
              </button>
              <button
                onClick={() => addToQueue(song.id)}
                className="inline-flex items-center gap-1.5 bg-br-purple-light text-br-purple-dark font-display font-bold text-xs px-4 py-2 rounded-pill active:scale-95 transition-transform"
              >
                <ListEnd size={14} /> Add to queue
              </button>
            </div>
          </>
        ) : (
          <div className="mt-6 inline-flex items-center gap-2 bg-br-blue-light text-br-ink/70 font-display font-bold text-sm px-6 py-3 rounded-pill">
            <Clock size={16} /> Coming soon
          </div>
        )}
      </div>

      <div className="px-6 mt-8 space-y-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-br-purple-light rounded-2xl py-3">
            <p className="text-[10px] font-bold text-br-purple-dark uppercase">Duration</p>
            <p className="font-display font-bold text-br-ink text-xs mt-1">{song.duration ? formatDuration(song.duration) : '—'}</p>
          </div>
          <div className="bg-br-pink-light rounded-2xl py-3">
            <p className="text-[10px] font-bold text-pink-700 uppercase">Genre</p>
            <p className="font-display font-bold text-br-ink text-xs mt-1">{song.genre || 'TBA'}</p>
          </div>
          <div className="bg-br-blue-light rounded-2xl py-3">
            <p className="text-[10px] font-bold text-blue-700 uppercase">Released</p>
            <p className="font-display font-bold text-br-ink text-xs mt-1">{formatDate(song.releaseDate)}</p>
          </div>
        </div>

        {song.description && (
          <div>
            <h2 className="font-display font-bold text-br-ink dark:text-white mb-1">About this song</h2>
            <p className="text-sm text-br-ink/70 dark:text-white/70 leading-relaxed">{song.description}</p>
          </div>
        )}

        {album && (
          <Link
            to={`/album/${album.id}`}
            className="block text-sm font-semibold text-br-purple-dark underline underline-offset-2"
          >
            View full album: {album.title} →
          </Link>
        )}
      </div>

      {albumMates.length > 0 && (
        <section className="mt-8">
          <SectionHeader title="More from this album" />
          <div className="px-3 space-y-1">
            {albumMates.map((s, i) => (
              <SongRow key={s.id} song={s} index={i + 1} contextIds={albumMates.map((x) => x.id)} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
