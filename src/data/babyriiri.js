/**
 * =============================================================
 *  BABYRIIRI — OFFICIAL CATALOGUE (single source of truth)
 * =============================================================
 * The catalogue lives in the repo as plain JSON files in /content:
 *
 *   content/songs/*.json          one file per song
 *   content/albums/*.json         one file per album
 *   content/playlists/*.json      one file per playlist
 *   content/announcements/*.json  homepage announcement cards
 *   content/artist.json           artist profile + bio + links
 *
 * Audio files live in  public/audio/   and artwork in  public/images/
 *
 * This module reads those files at build time and exposes them in the
 * exact shape every component already uses. Components never import
 * the JSON directly — so adding a song means adding ONE json file
 * (the admin panel at /admin does that for you) and nothing else.
 *
 * Visitors cannot change any of this: it's baked into the build.
 * Only a commit to the repo (via the authenticated admin panel or
 * VS Code) can change the catalogue.
 * =============================================================
 */

// ---- raw files (resolved by Vite at build time) -----------------
const songFiles = import.meta.glob('../../content/songs/*.json', { eager: true, import: 'default' })
const albumFiles = import.meta.glob('../../content/albums/*.json', { eager: true, import: 'default' })
const playlistFiles = import.meta.glob('../../content/playlists/*.json', { eager: true, import: 'default' })
const announcementFiles = import.meta.glob('../../content/announcements/*.json', { eager: true, import: 'default' })
const artistFile = import.meta.glob('../../content/artist.json', { eager: true, import: 'default' })

// ---- helpers --------------------------------------------------------
const PALETTE = ['#8B7CF6', '#FF9FC7', '#8FD3F4']

const hash = (str = '') => {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

// Generated artwork used until real artwork is uploaded. Same look as before:
// soft brand colour with the title in the centre.
const placeholderArt = (label = '') => {
  const bg = PALETTE[hash(label) % PALETTE.length]
  const safe = String(label).replace(/&/g, '&amp;').replace(/</g, '&lt;')
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">` +
    `<rect width="600" height="600" fill="${bg}"/>` +
    `<text x="50%" y="50%" font-family="Baloo 2, sans-serif" font-size="44" font-weight="700" ` +
    `fill="rgba(28,23,35,0.6)" text-anchor="middle" dominant-baseline="middle">${safe}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const slugFromPath = (path) => path.split('/').pop().replace(/\.json$/, '')

// "/audio/x.mp3" style paths only; leave full URLs alone.
const normalisePath = (p) => {
  if (!p || typeof p !== 'string') return ''
  const v = p.trim()
  if (!v) return ''
  if (/^(https?:|data:|\/)/i.test(v)) return v
  return `/${v}`
}

const entries = (files) => Object.entries(files).map(([path, data]) => ({ id: slugFromPath(path), ...(data || {}) }))

// Newest first (by release date, else the date it was added); anything undated
// follows in the manual `order` the files were seeded with.
const dateKey = (s) => {
  const t = Date.parse(s.releaseDate || s.addedAt || '')
  return Number.isNaN(t) ? null : t
}
const compareSongs = (a, b) => {
  const da = dateKey(a)
  const db = dateKey(b)
  if (da !== null && db !== null && da !== db) return db - da
  if (da !== null && db === null) return -1
  if (da === null && db !== null) return 1
  const oa = Number.isFinite(a.order) ? a.order : 9999
  const ob = Number.isFinite(b.order) ? b.order : 9999
  if (oa !== ob) return oa - ob
  return String(a.title).localeCompare(String(b.title))
}

// ---- artist ----------------------------------------------------------
const rawArtist = Object.values(artistFile)[0] || {}

export const artist = {
  id: 'babyriiri',
  name: 'BabyRiiri',
  tagline: '',
  bio: '',
  hometown: '',
  badge: '',
  genres: [],
  ...rawArtist,
  profileImage: normalisePath(rawArtist.profileImage) || placeholderArt(rawArtist.name || 'BabyRiiri'),
  heroImage: normalisePath(rawArtist.heroImage) || '',
  socials: { instagram: '', youtube: '', linktree: '', facebook: '', x: '', ...(rawArtist.socials || {}) }
}

// ---- songs ------------------------------------------------------------
export const songs = entries(songFiles)
  .filter((s) => s.title)
  .sort(compareSongs)
  .map((s) => {
    const audioSrc = normalisePath(s.audioSrc)
    return {
      artist: artist.name,
      featuredArtists: [],
      album: '',
      releaseDate: '',
      genre: '',
      description: '',
      featured: false,
      newRelease: false,
      trending: false,
      ...s,
      featuredArtists: (s.featuredArtists || []).filter(Boolean),
      artwork: normalisePath(s.artwork) || placeholderArt(s.title),
      audioSrc,
      hasAudio: Boolean(audioSrc),
      duration: Number.isFinite(Number(s.duration)) && Number(s.duration) > 0 ? Number(s.duration) : 0
    }
  })

const songById = new Map(songs.map((s) => [s.id, s]))

// ---- albums (tracklist is derived from each song's `album`) -----------
export const albums = entries(albumFiles)
  .filter((a) => a.title)
  .map((a) => {
    const tracks = songs
      .filter((s) => s.album === a.id)
      .sort((x, y) => {
        const tx = Number.isFinite(x.trackNumber) ? x.trackNumber : 9999
        const ty = Number.isFinite(y.trackNumber) ? y.trackNumber : 9999
        return tx - ty
      })
    return {
      artist: artist.name,
      releaseYear: '',
      description: '',
      ...a,
      artwork: normalisePath(a.artwork) || placeholderArt(a.title),
      songIds: tracks.map((s) => s.id)
    }
  })
  .sort((a, b) => String(b.releaseYear || '').localeCompare(String(a.releaseYear || '')) || a.title.localeCompare(b.title))

// ---- playlists ----------------------------------------------------------
export const playlists = entries(playlistFiles)
  .filter((p) => p.title)
  .map((p) => ({
    description: '',
    ...p,
    artwork: normalisePath(p.artwork) || placeholderArt(p.title),
    songIds: (p.songs || []).filter((id) => songById.has(id))
  }))
  .sort((a, b) => a.title.localeCompare(b.title))

// ---- announcements ---------------------------------------------------------
export const notifications = entries(announcementFiles)
  .filter((n) => n.title)
  .sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0))

// ---- homepage config (derived from the flags on each song) ------------------
export const homeConfig = {
  featuredSongId: (songs.find((s) => s.featured) || songs[0] || {}).id || null,
  newReleaseIds: songs.filter((s) => s.newRelease).map((s) => s.id),
  popularIds: songs.filter((s) => s.trending).map((s) => s.id),
  playlistIds: playlists.map((p) => p.id)
}

// ---- theme tokens -------------------------------------------------------------
export const theme = {
  purple: '#8B7CF6',
  pink: '#FF9FC7',
  blue: '#8FD3F4',
  white: '#FFFDF9',
  dark: '#241E30'
}

export const catalogue = Object.freeze({ artist, songs, albums, playlists, notifications, homeConfig, theme })
export const defaultContent = catalogue
