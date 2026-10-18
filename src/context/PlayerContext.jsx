import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useAudioPlayer } from '../hooks/useAudioPlayer'
import { useContent } from './ContentContext'
import { useTheme } from './ThemeContext'
import { loadQueue, saveQueue } from '../utils/storage'

const PlayerContext = createContext(null)

const NOTICE_NO_AUDIO = "This song's audio isn't live yet — check back soon!"

export function PlayerProvider({ children }) {
  const { songs, getSong, addRecent } = useContent()
  const { volume, setVolume } = useTheme()

  // ---- restore the last queue (paused) so the mini-player survives a reload ----
  const initial = useMemo(() => {
    const saved = loadQueue()
    const ids = saved.ids.filter((id) => getSong(id)?.hasAudio)
    const index = ids.length && saved.index >= 0 && saved.index < saved.ids.length
      ? Math.max(0, ids.indexOf(saved.ids[saved.index]))
      : -1
    return { ids, index: ids.length ? index : -1, shuffle: saved.shuffle, repeat: saved.repeat }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [queue, setQueue] = useState(initial.ids)
  const [queueIndex, setQueueIndex] = useState(initial.index)
  const [shuffle, setShuffle] = useState(initial.shuffle)
  const [repeat, setRepeat] = useState(initial.repeat) // off | all | one
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [notice, setNotice] = useState(null)

  // Mutable mirrors so callbacks (and the audio `ended` event) never go stale.
  const queueRef = useRef(initial.ids)
  const indexRef = useRef(initial.index)
  const shuffleRef = useRef(initial.shuffle)
  const repeatRef = useRef(initial.repeat)
  const historyRef = useRef([]) // indexes visited while shuffling, for "previous"
  const loadedIdRef = useRef(null) // which song the <audio> element currently holds
  const noticeTimer = useRef(null)

  const currentSongId = queueIndex >= 0 ? queue[queueIndex] : null
  const currentSong = useMemo(() => (currentSongId ? getSong(currentSongId) || null : null), [currentSongId, getSong])

  const showNotice = useCallback((msg) => {
    setNotice(msg)
    clearTimeout(noticeTimer.current)
    noticeTimer.current = setTimeout(() => setNotice(null), 2800)
  }, [])

  const setQueueBoth = (ids) => {
    queueRef.current = ids
    setQueue(ids)
  }
  const setIndexBoth = (i) => {
    indexRef.current = i
    setQueueIndex(i)
  }

  // The hook always calls the latest handler stored here, so auto-advance is never stale.
  const endedRef = useRef(() => {})
  const audio = useAudioPlayer({ volume, onEnded: () => endedRef.current() })
  const { load, play: audioPlay, pause, seek, getCurrentTime } = audio

  /** Start playing the song at `idx` of the current queue. */
  const startAt = useCallback(
    (idx) => {
      const id = queueRef.current[idx]
      const song = getSong(id)
      if (!song) return
      setIndexBoth(idx)
      loadedIdRef.current = id
      load(song.audioSrc, { autoplay: true })
      addRecent(id)
    },
    [getSong, load, addRecent]
  )

  const goNext = useCallback(
    (auto = false) => {
      const q = queueRef.current
      const i = indexRef.current
      if (!q.length) return
      if (shuffleRef.current && q.length > 1) {
        const others = q.map((_, n) => n).filter((n) => n !== i)
        historyRef.current.push(i)
        startAt(others[Math.floor(Math.random() * others.length)])
        return
      }
      let next = i + 1
      if (next >= q.length) {
        if (repeatRef.current === 'all' || (shuffleRef.current && q.length === 1 && repeatRef.current !== 'off')) next = 0
        else {
          if (auto) return // queue finished
          showNotice("That's the last song in your queue.")
          return
        }
      }
      startAt(next)
    },
    [startAt, showNotice]
  )

  const goPrevious = useCallback(() => {
    const q = queueRef.current
    if (!q.length) return
    if (getCurrentTime() > 3) {
      seek(0)
      return
    }
    if (shuffleRef.current && historyRef.current.length) {
      startAt(historyRef.current.pop())
      return
    }
    const prev = indexRef.current - 1
    if (prev < 0) {
      seek(0)
      return
    }
    startAt(prev)
  }, [startAt, seek, getCurrentTime])

  endedRef.current = () => {
    if (repeatRef.current === 'one') {
      seek(0)
      audioPlay()
      return
    }
    goNext(true)
  }

  /** Play a list of song ids starting at `startIndex`. Songs without audio are skipped. */
  const playQueue = useCallback(
    (songIds, startIndex = 0) => {
      if (!songIds || !songIds.length) return
      const startId = songIds[startIndex]
      const playable = songIds.filter((id) => getSong(id)?.hasAudio)
      if (!playable.length) {
        showNotice(NOTICE_NO_AUDIO)
        return
      }
      if (startId && !getSong(startId)?.hasAudio) showNotice(NOTICE_NO_AUDIO)
      const idx = Math.max(0, playable.indexOf(startId))
      historyRef.current = []
      setQueueBoth(playable)
      setIsPlayerOpen(true)
      startAt(idx)
    },
    [getSong, startAt, showNotice]
  )

  const playSong = useCallback(
    (songId, contextIds) => {
      const list = contextIds && contextIds.length ? contextIds : songs.map((s) => s.id)
      const idx = list.indexOf(songId)
      playQueue(list, idx === -1 ? 0 : idx)
    },
    [songs, playQueue]
  )

  const jumpTo = useCallback((idx) => {
    if (idx >= 0 && idx < queueRef.current.length) startAt(idx)
  }, [startAt])

  /** Put a song right after the current one. */
  const playNext = useCallback(
    (songId) => {
      const song = getSong(songId)
      if (!song?.hasAudio) return showNotice(NOTICE_NO_AUDIO)
      if (!queueRef.current.length) return playQueue([songId])
      const currentId = queueRef.current[indexRef.current]
      if (songId === currentId) return showNotice(`"${song.title}" is playing now`)
      const without = queueRef.current.filter((id) => id !== songId)
      const at = without.indexOf(currentId) + 1
      const next = [...without.slice(0, at), songId, ...without.slice(at)]
      historyRef.current = []
      setQueueBoth(next)
      setIndexBoth(next.indexOf(currentId))
      showNotice(`"${song.title}" plays next`)
    },
    [getSong, playQueue, showNotice]
  )

  const addToQueue = useCallback(
    (songId) => {
      const song = getSong(songId)
      if (!song?.hasAudio) return showNotice(NOTICE_NO_AUDIO)
      if (!queueRef.current.length) return playQueue([songId])
      if (queueRef.current.includes(songId)) return showNotice(`"${song.title}" is already in your queue`)
      setQueueBoth([...queueRef.current, songId])
      showNotice(`Added "${song.title}" to your queue`)
    },
    [getSong, playQueue, showNotice]
  )

  const toggleShuffle = useCallback(() => {
    setShuffle((s) => {
      shuffleRef.current = !s
      return !s
    })
  }, [])

  const cycleRepeat = useCallback(() => {
    setRepeat((r) => {
      const next = r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'
      repeatRef.current = next
      return next
    })
  }, [])

  /** Play / pause. If the song was only restored from last time, load it first. */
  const toggle = useCallback(() => {
    const id = queueRef.current[indexRef.current]
    if (!id) return
    if (loadedIdRef.current !== id) {
      loadedIdRef.current = id
      load(getSong(id)?.audioSrc, { autoplay: true })
      addRecent(id)
      return
    }
    audio.toggle()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSong, load, addRecent, audio.toggle])

  const play = useCallback(() => {
    const id = queueRef.current[indexRef.current]
    if (id && loadedIdRef.current !== id) {
      loadedIdRef.current = id
      load(getSong(id)?.audioSrc, { autoplay: true })
      addRecent(id)
    } else audioPlay()
  }, [getSong, load, addRecent, audioPlay])

  // ---- remember the queue (personal listener data) -----------------------------
  useEffect(() => {
    saveQueue({ ids: queue, index: queueIndex, shuffle, repeat })
  }, [queue, queueIndex, shuffle, repeat])

  // ---- Media Session: lock-screen / headset controls ---------------------------
  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentSong) return
    const isRaster = /^(\/|https?:).+\.(png|jpe?g|webp)(\?|$)/i.test(currentSong.artwork)
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: currentSong.title,
      artist: currentSong.artist || 'BabyRiiri',
      album: 'BabyRiiri',
      artwork: isRaster ? [{ src: currentSong.artwork, sizes: '512x512' }] : [{ src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }]
    })
  }, [currentSong])

  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    const set = (action, fn) => {
      try {
        navigator.mediaSession.setActionHandler(action, fn)
      } catch {
        /* action not supported on this browser */
      }
    }
    set('play', play)
    set('pause', pause)
    set('previoustrack', goPrevious)
    set('nexttrack', () => goNext(false))
    set('seekto', (d) => d.seekTime != null && seek(d.seekTime))
    set('seekbackward', (d) => seek(getCurrentTime() - (d.seekOffset || 10)))
    set('seekforward', (d) => seek(getCurrentTime() + (d.seekOffset || 10)))
  }, [play, pause, goNext, goPrevious, seek, getCurrentTime])

  useEffect(() => {
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = audio.isPlaying ? 'playing' : 'paused'
  }, [audio.isPlaying])

  useEffect(() => {
    if (!('mediaSession' in navigator) || !navigator.mediaSession.setPositionState) return
    if (!audio.duration || !Number.isFinite(audio.duration)) return
    try {
      navigator.mediaSession.setPositionState({
        duration: audio.duration,
        position: Math.min(audio.currentTime, audio.duration),
        playbackRate: 1
      })
    } catch {
      /* ignore invalid state */
    }
  }, [audio.currentTime, audio.duration])

  // Show what's playing in the browser tab.
  useEffect(() => {
    document.title = currentSong && audio.isPlaying ? `${currentSong.title} · BabyRiiri` : 'BabyRiiri'
  }, [currentSong, audio.isPlaying])

  // ---- desktop keyboard shortcuts ---------------------------------------------
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const tag = (e.target?.tagName || '').toUpperCase()
      if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(tag) || e.target?.isContentEditable) return
      if (!queueRef.current.length) return
      if (e.code === 'Space') {
        e.preventDefault()
        toggle()
      } else if (e.code === 'ArrowRight') {
        e.shiftKey ? goNext(false) : seek(getCurrentTime() + 5)
      } else if (e.code === 'ArrowLeft') {
        e.shiftKey ? goPrevious() : seek(getCurrentTime() - 5)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggle, goNext, goPrevious, seek, getCurrentTime])

  const value = useMemo(
    () => ({
      queue,
      queueIndex,
      currentSong,
      isPlaying: audio.isPlaying,
      isLoading: audio.isLoading,
      error: audio.error,
      currentTime: audio.currentTime,
      duration: audio.duration || currentSong?.duration || 0,
      volume,
      shuffle,
      repeat,
      isPlayerOpen,
      notice,
      setIsPlayerOpen,
      setVolume,
      playSong,
      playQueue,
      playNext,
      addToQueue,
      jumpTo,
      toggle,
      play,
      pause,
      seek,
      goNext: () => goNext(false),
      goPrevious,
      toggleShuffle,
      cycleRepeat
    }),
    [
      queue, queueIndex, currentSong, audio.isPlaying, audio.isLoading, audio.error, audio.currentTime,
      audio.duration, volume, shuffle, repeat, isPlayerOpen, notice, setVolume, playSong, playQueue,
      playNext, addToQueue, jumpTo, toggle, play, pause, seek, goNext, goPrevious, toggleShuffle, cycleRepeat
    ]
  )

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider')
  return ctx
}
