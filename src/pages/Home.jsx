import { Link } from 'react-router-dom'
import { Play, Info } from 'lucide-react'
import TopBar from '../components/navigation/TopBar'
import SearchBar from '../components/ui/SearchBar'
import SectionHeader from '../components/ui/SectionHeader'
import SongCard from '../components/cards/SongCard'
import PlaylistCard from '../components/cards/PlaylistCard'
import SongRow from '../components/music/SongRow'
import FavoriteButton from '../components/music/FavoriteButton'
import Badge from '../components/ui/Badge'
import { useContent } from '../context/ContentContext'
import { usePlayer } from '../context/PlayerContext'
import { useNavigate } from 'react-router-dom'
import InstallCard from '../components/ui/InstallCard'

export default function Home() {
  const { songs, playlists, homeConfig, notifications, getSong, recentIds } = useContent()
  const { playSong } = usePlayer()
  const navigate = useNavigate()

  // Derived from each song's own flags (set in the admin panel) so the
  // homepage always reflects the catalogue without a separate config step.
  const featured = songs.find((s) => s.featured) || getSong(homeConfig.featuredSongId) || songs[0]
  const newReleases = songs.filter((s) => s.newRelease)
  const popular = songs.filter((s) => s.trending)
  const displayPlaylists = playlists
  const allSongIds = songs.map((s) => s.id)
  const recent = recentIds.map(getSong).filter(Boolean).slice(0, 10)

  return (
    <div className="pb-6">
      <TopBar title="BABYRIIRI" />

      <div className="px-5 mb-6">
        <SearchBar value="" onChange={() => navigate('/search')} onFocus={() => navigate('/search')} />
      </div>

      {/* Featured */}
      {featured && (
        <section className="px-5 mb-8">
          <p className="text-[11px] font-display font-bold tracking-widest text-br-purple-dark uppercase mb-2">
            Featured
          </p>
          <div className="rounded-card border-2 border-br-ink/10 bg-br-purple text-white shadow-soft overflow-hidden relative">
            <Badge label="FEATURED" className="absolute top-4 right-4 z-10" />
            <div className="p-5 pb-0">
              <h2 className="font-display text-3xl font-extrabold leading-tight">{featured.title}</h2>
              <p className="text-white/70 font-semibold mt-0.5">
                {featured.artist}
                {featured.featuredArtists?.length ? ` feat. ${featured.featuredArtists.join(', ')}` : ''}
              </p>
            </div>
            <div className="mt-4 px-5">
              <img
                src={featured.artwork}
                alt={featured.title}
                className="w-full aspect-[16/10] object-cover rounded-t-2xl border-t border-x border-white/10"
              />
            </div>
            <div className="flex items-center gap-3 px-5 py-4 bg-br-purple-dark/40">
              <button
                onClick={() => playSong(featured.id, allSongIds)}
                className="flex items-center gap-2 bg-white text-br-purple-dark font-display font-bold text-sm px-4 py-2.5 rounded-pill shadow-sm active:scale-95 transition-transform"
              >
                <Play size={16} fill="currentColor" /> {featured.hasAudio ? 'Play' : 'Coming soon'}
              </button>
              <Link
                to={`/song/${featured.id}`}
                className="flex items-center gap-1.5 text-sm font-semibold text-white/90"
              >
                <Info size={18} /> Details
              </Link>
              <div className="ml-auto">
                <FavoriteButton songId={featured.id} size={22} className="text-white" />
              </div>
            </div>
          </div>
        </section>
      )}

      <InstallCard />

      {/* Jump back in */}
      {recent.length > 0 && (
        <section className="mb-8">
          <SectionHeader title="Jump Back In" actionTo="/library" />
          <div className="flex gap-4 overflow-x-auto px-5 pb-1 no-scrollbar">
            {recent.map((song) => (
              <SongCard key={song.id} song={song} contextIds={recent.map((s) => s.id)} />
            ))}
          </div>
        </section>
      )}

      {/* New Releases */}
      {newReleases.length > 0 && (
        <section className="mb-8">
          <SectionHeader title="New Releases" actionTo="/explore" />
          <div className="flex gap-4 overflow-x-auto px-5 pb-1 no-scrollbar">
            {newReleases.map((song) => (
              <SongCard key={song.id} song={song} contextIds={newReleases.map((s) => s.id)} />
            ))}
          </div>
        </section>
      )}

      {/* Popular / Listen Now */}
      {popular.length > 0 && (
        <section className="mb-8">
          <SectionHeader title="Listen Now" actionTo="/explore" />
          <div className="px-3 space-y-1">
            {popular.map((song, i) => (
              <SongRow key={song.id} song={song} index={i + 1} contextIds={popular.map((s) => s.id)} />
            ))}
          </div>
        </section>
      )}

      {/* Playlists */}
      {displayPlaylists.length > 0 && (
        <section className="mb-8">
          <SectionHeader title="Playlists" actionTo="/library" />
          <div className="flex gap-4 overflow-x-auto px-5 pb-1 no-scrollbar">
            {displayPlaylists.map((playlist, i) => (
              <PlaylistCard key={playlist.id} playlist={playlist} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Notifications */}
      {notifications.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Announcements" />
          <div className="px-5 space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="flex items-start gap-3 bg-br-blue-light border-2 border-br-ink/10 rounded-2xl p-4"
              >
                <Badge label={n.tag} />
                <div className="min-w-0">
                  <p className="font-display font-bold text-sm text-br-ink">{n.title}</p>
                  <p className="text-xs text-br-ink/60 mt-0.5">{n.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
