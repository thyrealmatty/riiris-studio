import { Link } from 'react-router-dom'
import { Settings, Instagram, Youtube, Link2, Facebook, Twitter, MapPin, Play, Shuffle } from 'lucide-react'
import SectionHeader from '../components/ui/SectionHeader'
import SongRow from '../components/music/SongRow'
import AlbumCard from '../components/cards/AlbumCard'
import PlaylistCard from '../components/cards/PlaylistCard'
import Badge from '../components/ui/Badge'
import ShareButton from '../components/ui/ShareButton'
import { useContent } from '../context/ContentContext'
import { usePlayer } from '../context/PlayerContext'
import { shuffled } from '../utils/format'

const SOCIALS = [
  { key: 'instagram', label: 'Instagram', icon: Instagram },
  { key: 'youtube', label: 'YouTube', icon: Youtube },
  { key: 'facebook', label: 'Facebook', icon: Facebook },
  { key: 'x', label: 'X', icon: Twitter },
  { key: 'linktree', label: 'All links', icon: Link2 }
]

export default function Profile() {
  const { artist, songs, albums, playlists } = useContent()
  const { playQueue } = usePlayer()

  const popularSongs = songs.filter((s) => s.trending || s.featured).slice(0, 5)
  const socialLinks = SOCIALS.filter((s) => artist.socials?.[s.key])
  const mainFollow = socialLinks.find((s) => s.key === 'instagram') || socialLinks.find((s) => s.key === 'youtube')
  const allIds = songs.map((s) => s.id)

  return (
    <div className="pb-6">
      <div className="relative">
        {artist.heroImage ? (
          <img src={artist.heroImage} alt="" className="h-40 w-full object-cover" />
        ) : (
          <div className="h-40 w-full bg-br-purple" />
        )}
        <Link to="/settings" className="absolute top-6 right-5 p-2 bg-white/90 rounded-full shadow-sm" aria-label="Settings">
          <Settings size={20} className="text-br-ink" />
        </Link>
        <div className="px-5 -mt-14">
          <img
            src={artist.profileImage}
            alt={artist.name}
            className="w-28 h-28 rounded-full object-cover border-4 border-br-white dark:border-br-dark shadow-soft"
          />
        </div>
      </div>

      <div className="px-5 mt-3">
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-extrabold text-br-ink dark:text-white">{artist.name}</h1>
          {artist.badge && <Badge label={artist.badge} />}
          <ShareButton title={artist.name} text={`Listen to ${artist.name}`} path="/profile" className="ml-auto" />
        </div>
        {artist.tagline && <p className="text-sm text-br-ink/60 dark:text-white/60 mt-1">{artist.tagline}</p>}
        {artist.hometown && (
          <p className="flex items-center gap-1 text-xs font-semibold text-br-ink/50 dark:text-white/50 mt-2">
            <MapPin size={13} /> {artist.hometown}
          </p>
        )}

        <div className="flex items-center gap-5 mt-4">
          <div>
            <p className="font-display font-extrabold text-br-ink dark:text-white">{songs.length}</p>
            <p className="text-xs text-br-ink/50 dark:text-white/50">Songs</p>
          </div>
          <div>
            <p className="font-display font-extrabold text-br-ink dark:text-white">{albums.length}</p>
            <p className="text-xs text-br-ink/50 dark:text-white/50">{albums.length === 1 ? 'Album' : 'Albums'}</p>
          </div>
          {mainFollow && (
            <a
              href={artist.socials[mainFollow.key]}
              target="_blank"
              rel="noreferrer"
              className="ml-auto px-5 py-2 rounded-pill font-display font-bold text-sm shadow-sm active:scale-95 transition-transform bg-br-purple text-white"
            >
              Follow
            </a>
          )}
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => playQueue(allIds)}
            disabled={!songs.length}
            className="flex items-center gap-2 bg-br-purple-light text-br-purple-dark font-display font-bold px-5 py-2.5 rounded-pill active:scale-95 transition-transform disabled:opacity-40"
          >
            <Play size={16} fill="currentColor" /> Play
          </button>
          <button
            onClick={() => playQueue(shuffled(allIds))}
            disabled={!songs.length}
            className="flex items-center gap-2 bg-br-purple-light text-br-purple-dark font-display font-bold px-5 py-2.5 rounded-pill active:scale-95 transition-transform disabled:opacity-40"
          >
            <Shuffle size={16} /> Shuffle
          </button>
        </div>

        {socialLinks.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {socialLinks.map(({ key, icon: Icon, label }) => (
              <a
                key={key}
                href={artist.socials[key]}
                target="_blank"
                rel="noreferrer"
                aria-label={`${artist.name} on ${label}`}
                className="w-9 h-9 rounded-full bg-br-purple-light flex items-center justify-center text-br-purple-dark"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        )}

        {artist.bio && (
          <p className="text-sm leading-relaxed text-br-ink/70 dark:text-white/70 mt-5">{artist.bio}</p>
        )}
        {artist.genres?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {artist.genres.map((g) => (
              <span key={g} className="text-[11px] font-display font-bold px-2.5 py-1 rounded-pill bg-br-blue-light text-br-ink/70">
                {g}
              </span>
            ))}
          </div>
        )}
      </div>

      {popularSongs.length > 0 && (
        <section className="mt-8">
          <SectionHeader title="Popular Songs" />
          <div className="px-3 space-y-1">
            {popularSongs.map((song, i) => (
              <SongRow key={song.id} song={song} index={i + 1} contextIds={popularSongs.map((s) => s.id)} />
            ))}
          </div>
        </section>
      )}

      {albums.length > 0 && (
        <section className="mt-8">
          <SectionHeader title="Albums" />
          <div className="flex gap-4 overflow-x-auto px-5 pb-1 no-scrollbar">
            {albums.map((a) => (
              <AlbumCard key={a.id} album={a} />
            ))}
          </div>
        </section>
      )}

      {playlists.length > 0 && (
        <section className="mt-8">
          <SectionHeader title="Playlists" />
          <div className="flex gap-4 overflow-x-auto px-5 pb-1 no-scrollbar">
            {playlists.map((p, i) => (
              <PlaylistCard key={p.id} playlist={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
