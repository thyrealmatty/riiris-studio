import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { catalogue } from '../data/babyriiri'
import {
  loadFavorites,
  saveFavorites,
  loadRecents,
  saveRecents,
  clearListenerData
} from '../utils/storage'

/**
 * Read-only catalogue + this listener's personal data.
 *
 * The catalogue (songs, albums, playlists, artist, announcements) comes from
 * src/data/babyriiri.js and is baked into the build — there is deliberately
 * NO function here that can add, edit or delete it.
 */
const ContentContext = createContext(null)

const songsById = new Map(catalogue.songs.map((s) => [s.id, s]))
const albumsById = new Map(catalogue.albums.map((a) => [a.id, a]))
const playlistsById = new Map(catalogue.playlists.map((p) => [p.id, p]))

export function ContentProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useState(() => loadFavorites().filter((id) => songsById.has(id)))
  const [recentIds, setRecentIds] = useState(() => loadRecents().filter((id) => songsById.has(id)))

  const toggleFavorite = useCallback((songId) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(songId) ? prev.filter((id) => id !== songId) : [songId, ...prev]
      saveFavorites(next)
      return next
    })
  }, [])

  const isFavorite = useCallback((songId) => favoriteIds.includes(songId), [favoriteIds])

  const addRecent = useCallback((songId) => {
    setRecentIds((prev) => {
      const next = [songId, ...prev.filter((id) => id !== songId)].slice(0, 20)
      saveRecents(next)
      return next
    })
  }, [])

  const clearRecents = useCallback(() => {
    setRecentIds([])
    saveRecents([])
  }, [])

  const clearFavorites = useCallback(() => {
    setFavoriteIds([])
    saveFavorites([])
  }, [])

  const wipeListenerData = useCallback(() => {
    clearListenerData()
    setFavoriteIds([])
    setRecentIds([])
  }, [])

  const getSong = useCallback((id) => songsById.get(id), [])
  const getAlbum = useCallback((id) => albumsById.get(id), [])
  const getPlaylist = useCallback((id) => playlistsById.get(id), [])

  const value = useMemo(
    () => ({
      content: catalogue,
      songs: catalogue.songs,
      albums: catalogue.albums,
      playlists: catalogue.playlists,
      artist: catalogue.artist,
      notifications: catalogue.notifications,
      homeConfig: catalogue.homeConfig,
      theme: catalogue.theme,
      favoriteIds,
      recentIds,
      getSong,
      getAlbum,
      getPlaylist,
      toggleFavorite,
      isFavorite,
      addRecent,
      clearRecents,
      clearFavorites,
      wipeListenerData
    }),
    [favoriteIds, recentIds, getSong, getAlbum, getPlaylist, toggleFavorite, isFavorite, addRecent, clearRecents, clearFavorites, wipeListenerData]
  )

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within ContentProvider')
  return ctx
}
