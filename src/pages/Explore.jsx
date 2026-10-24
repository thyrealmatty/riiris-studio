import TopBar from '../components/navigation/TopBar'
import SectionHeader from '../components/ui/SectionHeader'
import SongCard from '../components/cards/SongCard'
import SongRow from '../components/music/SongRow'
import PlaylistCard from '../components/cards/PlaylistCard'
import AlbumCard from '../components/cards/AlbumCard'
import EmptyState from '../components/ui/EmptyState'
import { useContent } from '../context/ContentContext'

export default function Explore() {
  const { songs, albums, playlists } = useContent()

  const newReleases = songs.filter((s) => s.newRelease)
  const trending = songs.filter((s) => s.trending)
  const featured = songs.filter((s) => s.featured)
  const allIds = songs.map((s) => s.id)

  if (songs.length === 0) {
    return (
      <div className="pb-6">
        <TopBar title="Explore" showAvatar={false} />
        <EmptyState title="Nothing to explore yet" subtitle="New releases and trending songs will show up here." />
      </div>
    )
  }

  return (
    <div className="pb-6">
      <TopBar title="Explore" showAvatar={false} />

      {newReleases.length > 0 && (
        <section className="mb-8">
          <SectionHeader title="New Releases" />
          <div className="flex gap-4 overflow-x-auto px-5 pb-1 no-scrollbar">
            {newReleases.map((song) => (
              <SongCard key={song.id} song={song} contextIds={newReleases.map((s) => s.id)} />
            ))}
          </div>
        </section>
      )}

      {trending.length > 0 && (
        <section className="mb-8">
          <SectionHeader title="Trending" />
          <div className="px-3 space-y-1">
            {trending.map((song, i) => (
              <SongRow key={song.id} song={song} index={i + 1} contextIds={trending.map((s) => s.id)} />
            ))}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="mb-8">
          <SectionHeader title="Featured" />
          <div className="flex gap-4 overflow-x-auto px-5 pb-1 no-scrollbar">
            {featured.map((song) => (
              <SongCard key={song.id} song={song} contextIds={featured.map((s) => s.id)} />
            ))}
          </div>
        </section>
      )}

      <section className="mb-8">
        <SectionHeader title="All Songs" />
        <div className="px-3 space-y-1">
          {songs.map((song, i) => (
            <SongRow key={song.id} song={song} index={i + 1} contextIds={allIds} />
          ))}
        </div>
      </section>

      {playlists.length > 0 && (
        <section className="mb-8">
          <SectionHeader title="Playlists" />
          <div className="flex gap-4 overflow-x-auto px-5 pb-1 no-scrollbar">
            {playlists.map((p, i) => (
              <PlaylistCard key={p.id} playlist={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {albums.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Albums" />
          <div className="flex gap-4 overflow-x-auto px-5 pb-1 no-scrollbar">
            {albums.map((a) => (
              <AlbumCard key={a.id} album={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
