/**
 * Listener-only storage. Nothing here can change the official catalogue —
 * it only remembers things about THIS listener on THIS device:
 * favorites, recently played, queue, theme / volume preferences.
 */
const FAVORITES_KEY = 'babyriiri:favorites:v1'
const RECENTS_KEY = 'babyriiri:recents:v1'
const PREFS_KEY = 'babyriiri:prefs:v1'
const QUEUE_KEY = 'babyriiri:queue:v1'
const INSTALL_DISMISSED_KEY = 'babyriiri:install-dismissed:v1'

// Older builds let the app store (and override) catalogue content locally.
// That's gone — drop any leftovers so a stale copy can never shadow the real one.
const LEGACY_KEYS = ['babyriiri:content:v1']

function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function purgeLegacyData() {
  try {
    LEGACY_KEYS.forEach((k) => localStorage.removeItem(k))
  } catch {
    /* storage unavailable — nothing to purge */
  }
}

const asIdList = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [])

export const loadFavorites = () => asIdList(safeGet(FAVORITES_KEY, []))
export const saveFavorites = (ids) => safeSet(FAVORITES_KEY, ids)

export const loadRecents = () => asIdList(safeGet(RECENTS_KEY, []))
export const saveRecents = (ids) => safeSet(RECENTS_KEY, ids)

const DEFAULT_PREFS = { theme: 'light', accent: 'purple', volume: 0.8 }
export function loadPrefs() {
  const p = safeGet(PREFS_KEY, DEFAULT_PREFS)
  const volume = Number(p.volume)
  return {
    ...DEFAULT_PREFS,
    ...p,
    theme: p.theme === 'dark' ? 'dark' : 'light',
    volume: Number.isFinite(volume) ? Math.min(1, Math.max(0, volume)) : DEFAULT_PREFS.volume
  }
}
export const savePrefs = (prefs) => safeSet(PREFS_KEY, prefs)

export function loadQueue() {
  const q = safeGet(QUEUE_KEY, null)
  if (!q || typeof q !== 'object') return { ids: [], index: -1, shuffle: false, repeat: 'off' }
  return {
    ids: asIdList(q.ids),
    index: Number.isInteger(q.index) ? q.index : -1,
    shuffle: Boolean(q.shuffle),
    repeat: ['off', 'all', 'one'].includes(q.repeat) ? q.repeat : 'off'
  }
}
export const saveQueue = (q) => safeSet(QUEUE_KEY, q)

export const isInstallDismissed = () => Boolean(safeGet(INSTALL_DISMISSED_KEY, false))
export const dismissInstall = () => safeSet(INSTALL_DISMISSED_KEY, true)

export function clearListenerData() {
  try {
    ;[FAVORITES_KEY, RECENTS_KEY, QUEUE_KEY].forEach((k) => localStorage.removeItem(k))
  } catch {
    /* ignore */
  }
}
