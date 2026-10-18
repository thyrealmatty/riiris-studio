import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import SearchBar from '../components/ui/SearchBar'
import SongRow from '../components/music/SongRow'
import PlaylistCard from '../components/cards/PlaylistCard'
import AlbumCard from '../components/cards/AlbumCard'
import EmptyState from '../components/ui/EmptyState'
import { useContent } from '../context/ContentContext'

export default function Search() {
  const { songs, albums, playlists, artist } = useContent()
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()

  // Every word typed must appear somewhere in the item's searchable text.
  const results = useMemo(() => {
    if (!q) return null
    const words = q.split(/\s+/)
    const matches = (text) => words.every((w) => text.includes(w))
    return {
      songs: songs.filter((s) =>
        matches([s.title, s.artist, ...(s.featuredArtists || []), s.genre].join(' ').toLowerCase())
      ),
      albums: albums.filter((a) => matches(`${a.title} ${a.artist}`.toLowerCase())),
      playlists: playlists.filter((p) => matches(`${p.title} ${p.description || ''}`.toLowerCase())),
      artistMatch: matches(`${artist.name} ${(artist.genres || []).join(' ')}`.toLowerCase())
    }
  }, [q, songs, albums, playlists, artist])

  const hasAnyResults =
    results && (results.songs.length || results.albums.length || results.playlists.length || results.artistMatch)

  return (
    <div className="pb-6">
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <Link to="/" className="p-1 -ml-1" aria-label="Back">
          <ArrowLeft size={22} className="text-br-ink dark:text-white" />
        </Link>
        <div className="flex-1">
          <SearchBar value={query} onChange={setQuery} autoFocus placeholder="Search songs, albums, playlists…" />
        </div>
      </div>

      {!q && (
        <>
          <EmptyState title="Search BabyRiiri's music" subtitle="Find songs, albums, and playlists." />
          {songs.length > 0 && (
            <div className="px-5 mt-2">
              <p className="text-[11px] font-display font-bold tracking-widest text-br-ink/40 dark:text-white/40 uppercase mb-2">
                Try
              </p>
              <div className="flex flex-wrap gap-2">
                {songs.slice(0, 8).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setQuery(s.title)}
                    className="text-xs font-display font-bold px-3 py-1.5 rounded-pill bg-br-purple-light text-br-purple-dark active:scale-95 transition-transform"
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {q && !hasAnyResults && (
        <EmptyState title="No music found" subtitle={`Nothing matches "${query}" yet.`} />
      )}

      {q && hasAnyResults && (
        <div className="space-y-8">
          {results.artistMatch && (
            <section className="px-5">
              <h2 className="font-display text-lg font-bold mb-2 text-br-ink dark:text-white">Artist</h2>
              <Link to="/profile" className="flex items-center gap-3 bg-white dark:bg-br-dark-soft border-2 border-br-ink/10 rounded-2xl p-3">
                <img src={artist.profileImage} alt="" className="w-12 h-12 rounded-full object-cover" />
                <p className="font-display font-bold text-br-ink dark:text-white">{artist.name}</p>
              </Link>
            </section>
          )}

          {results.songs.length > 0 && (
            <section>
              <h2 className="font-display text-lg font-bold mb-2 px-5 text-br-ink dark:text-white">Songs</h2>
              <div className="px-3 space-y-1">
                {results.songs.map((song, i) => (
                  <SongRow key={song.id} song={song} index={i + 1} contextIds={results.songs.map((s) => s.id)} />
                ))}
              </div>
            </section>
          )}

          {results.playlists.length > 0 && (
            <section>
              <h2 className="font-display text-lg font-bold mb-2 px-5 text-br-ink dark:text-white">Playlists</h2>
              <div className="flex gap-4 overflow-x-auto px-5 pb-1 no-scrollbar">
                {results.playlists.map((p, i) => (
                  <PlaylistCard key={p.id} playlist={p} index={i} />
                ))}
              </div>
            </section>
          )}

          {results.albums.length > 0 && (
            <section>
              <h2 className="font-display text-lg font-bold mb-2 px-5 text-br-ink dark:text-white">Albums</h2>
              <div className="flex gap-4 overflow-x-auto px-5 pb-1 no-scrollbar">
                {results.albums.map((a) => (
                  <AlbumCard key={a.id} album={a} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
