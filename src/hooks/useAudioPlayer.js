import { useCallback, useEffect, useRef, useState } from 'react'

export const MSG_NO_AUDIO = "Coming soon — this song's audio isn't live yet."
export const MSG_FAILED = "We couldn't play this song. Check your connection and try again."
export const MSG_BLOCKED = 'Tap play to start the music.'

/**
 * Wraps a single <audio> element and exposes a clean, STABLE playback API
 * (every function keeps the same identity between renders).
 * The latest onEnded callback is always used, so auto-advance never sees
 * a stale queue.
 */
export function useAudioPlayer({ volume = 0.8, onEnded } = {}) {
  const audioRef = useRef(null)
  const onEndedRef = useRef(onEnded)
  const playingRef = useRef(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  onEndedRef.current = onEnded

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audio.volume = volume
    audio.setAttribute('playsinline', '')
    audioRef.current = audio

    const handlers = {
      timeupdate: () => setCurrentTime(audio.currentTime),
      durationchange: () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0),
      loadedmetadata: () => {
        setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
        setIsLoading(false)
      },
      play: () => {
        playingRef.current = true
        setIsPlaying(true)
      },
      pause: () => {
        playingRef.current = false
        setIsPlaying(false)
      },
      waiting: () => setIsLoading(true),
      playing: () => setIsLoading(false),
      canplay: () => setIsLoading(false),
      ended: () => {
        playingRef.current = false
        setIsPlaying(false)
        onEndedRef.current?.()
      },
      error: () => {
        if (!audio.getAttribute('src')) return
        setIsLoading(false)
        setIsPlaying(false)
        setError(MSG_FAILED)
      }
    }
    Object.entries(handlers).forEach(([evt, fn]) => audio.addEventListener(evt, fn))

    return () => {
      audio.pause()
      Object.entries(handlers).forEach(([evt, fn]) => audio.removeEventListener(evt, fn))
      audio.removeAttribute('src')
      audio.load()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  const play = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !audio.getAttribute('src')) {
      setError(MSG_NO_AUDIO)
      return
    }
    setError(null)
    const p = audio.play()
    if (p && p.catch) {
      p.catch((err) => {
        if (err && err.name === 'AbortError') return // a new load interrupted this play — fine
        setError(err && err.name === 'NotAllowedError' ? MSG_BLOCKED : MSG_FAILED)
      })
    }
  }, [])

  const pause = useCallback(() => {
    audioRef.current?.pause()
  }, [])

  const toggle = useCallback(() => {
    if (playingRef.current) pause()
    else play()
  }, [play, pause])

  const load = useCallback(
    (src, { autoplay = false } = {}) => {
      const audio = audioRef.current
      if (!audio) return
      setError(null)
      setCurrentTime(0)
      setDuration(0)
      if (!src) {
        audio.pause()
        audio.removeAttribute('src')
        audio.load()
        setIsLoading(false)
        setError(MSG_NO_AUDIO)
        return
      }
      setIsLoading(true)
      audio.src = src
      audio.load()
      if (autoplay) play()
    },
    [play]
  )

  const seek = useCallback((time) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(time)) return
    audio.currentTime = Math.max(0, time)
    setCurrentTime(audio.currentTime)
  }, [])

  const getCurrentTime = useCallback(() => audioRef.current?.currentTime || 0, [])

  return { isPlaying, currentTime, duration, isLoading, error, load, play, pause, toggle, seek, getCurrentTime }
}
