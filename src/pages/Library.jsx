import { Heart, Clock, ListMusic, Disc3 } from 'lucide-react'
import TopBar from '../components/navigation/TopBar'
import SectionHeader from '../components/ui/SectionHeader'
import SongRow from '../components/music/SongRow'
import PlaylistCard from '../components/cards/PlaylistCard'
import AlbumCard from '../components/cards/AlbumCard'
import EmptyState from '../components/ui/EmptyState'
import { useContent } from '../context/ContentContext'

export default function Library() {
  const { songs, albums, playlists, favoriteIds, recentIds, getSong } = useContent()

  const favoriteSongs = favoriteIds.map(getSong).filter(Boolean)
  const recentSongs = recentIds.map(getSong).filter(Boolean)

  return (
    <div className="pb-6">
      <TopBar title="Library" showAvatar={false} />

      <section className="mb-8">
        <SectionHeader title="Recently Played" />
        {recentSongs.length ? (
          <div className="px-3 space-y-1">
            {recentSongs.slice(0, 6).map((song, i) => (
              <SongRow key={song.id} song={song} index={i + 1} contextIds={recentSongs.map((s) => s.id)} />
            ))}
          </div>
        ) : (
          <EmptyState icon={Clock} title="Nothing played yet" subtitle="Songs you listen to will show up here." />
        )}
      </section>

      <section className="mb-8">
        <SectionHeader title="Liked Songs" />
        {favoriteSongs.length ? (
          <div className="px-3 space-y-1">
            {favoriteSongs.map((song, i) => (
              <SongRow key={song.id} song={song} index={i + 1} contextIds={favoriteSongs.map((s) => s.id)} />
            ))}
          </div>
        ) : (
          <EmptyState icon={Heart} title="Your favorites will appear here" subtitle="Tap the heart on any song to save it." />
        )}
      </section>

      <section className="mb-8">
        <SectionHeader title="Playlists" />
        {playlists.length ? (
          <div className="flex gap-4 overflow-x-auto px-5 pb-1 no-scrollbar">
            {playlists.map((p, i) => (
              <PlaylistCard key={p.id} playlist={p} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState icon={ListMusic} title="No playlists yet" subtitle="New playlists will show up here." />
        )}
      </section>

      <section className="mb-4">
        <SectionHeader title="Albums" />
        {albums.length ? (
          <div className="flex gap-4 overflow-x-auto px-5 pb-1 no-scrollbar">
            {albums.map((a) => (
              <AlbumCard key={a.id} album={a} />
            ))}
          </div>
        ) : (
          <EmptyState icon={Disc3} title="No albums yet" />
        )}
      </section>

      {songs.length === 0 && <EmptyState title="No songs yet" subtitle="BabyRiiri's music is on the way — check back soon!" />}
    </div>
  )
}
