import { Play, Pause } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Badge from '../ui/Badge'
import FavoriteButton from './FavoriteButton'
import AudioWaveform from '../player/AudioWaveform'
import { usePlayer } from '../../context/PlayerContext'
import { formatDuration } from '../../utils/format'

export default function SongRow({ song, index, contextIds, showAlbumArt = true }) {
  const { playSong, currentSong, isPlaying, toggle } = usePlayer()
  const navigate = useNavigate()
  const isCurrent = currentSong?.id === song.id

  const handleClick = () => {
    // Songs without audio yet open their page instead of failing silently.
    if (!song.hasAudio) return navigate(`/song/${song.id}`)
    if (isCurrent) toggle()
    else playSong(song.id, contextIds)
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-colors text-left ${
        isCurrent ? 'bg-br-purple-light dark:bg-br-dark-soft' : 'hover:bg-br-purple-light/50 dark:hover:bg-white/5'
      }`}
    >
      {showAlbumArt ? (
        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-br-ink/10 shrink-0">
          <img src={song.artwork} alt="" loading="lazy" className="w-full h-full object-cover" />
          {isCurrent && (
            <div className="absolute inset-0 bg-br-ink/50 flex items-center justify-center">
              <AudioWaveform playing={isPlaying} color="#fff" size="sm" />
            </div>
          )}
        </div>
      ) : (
        <div className="w-6 text-center shrink-0">
          {isCurrent ? (
            isPlaying ? (
              <Pause size={16} className="text-br-purple mx-auto" />
            ) : (
              <Play size={16} className="text-br-purple mx-auto" />
            )
          ) : (
            <span className="text-sm font-semibold text-br-ink/40 dark:text-white/40">{index}</span>
          )}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p
          className={`font-display font-bold text-sm truncate ${
            isCurrent ? 'text-br-purple-dark' : 'text-br-ink dark:text-white'
          }`}
        >
          {song.title}
        </p>
        <p className="text-xs text-br-ink/50 dark:text-white/50 truncate">
          {song.artist}
          {song.featuredArtists?.length ? ` feat. ${song.featuredArtists.join(', ')}` : ''}
        </p>
      </div>

      {song.trending && song.hasAudio && <Badge label="TRENDING" className="hidden sm:inline-flex" />}
      <FavoriteButton songId={song.id} size={17} />
      {song.hasAudio ? (
        <span className="text-xs font-semibold text-br-ink/40 dark:text-white/40 w-10 text-right shrink-0">
          {song.duration ? formatDuration(song.duration) : ''}
        </span>
      ) : (
        <Badge label="SOON" className="shrink-0" />
      )}
    </button>
  )
}
