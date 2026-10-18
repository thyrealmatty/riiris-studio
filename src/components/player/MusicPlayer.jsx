import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  ListMusic
} from 'lucide-react'
import { usePlayer } from '../../context/PlayerContext'
import FavoriteButton from '../music/FavoriteButton'
import AudioWaveform from './AudioWaveform'
import Badge from '../ui/Badge'
import ShareButton from '../ui/ShareButton'
import QueueSheet from './QueueSheet'
import { formatDuration } from '../../utils/format'

export default function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    isPlayerOpen,
    setIsPlayerOpen,
    currentTime,
    duration,
    toggle,
    goNext,
    goPrevious,
    seek,
    shuffle,
    repeat,
    toggleShuffle,
    cycleRepeat,
    volume,
    setVolume,
    error
  } = usePlayer()
  const [showQueue, setShowQueue] = useState(false)

  return (
    <AnimatePresence>
      {isPlayerOpen && currentSong && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 32, stiffness: 300 }}
          className="fixed inset-0 z-50 bg-br-white dark:bg-br-dark flex flex-col"
          style={{
            paddingTop: 'env(safe-area-inset-top, 0px)',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)'
          }}
        >
          {/* header */}
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <button
              onClick={() => setIsPlayerOpen(false)}
              aria-label="Minimize player"
              className="p-2 -ml-2 rounded-full hover:bg-br-purple-light"
            >
              <ChevronDown size={26} className="text-br-ink dark:text-white" />
            </button>
            <p className="font-display font-bold text-xs tracking-widest text-br-ink/40 dark:text-white/40 uppercase">
              Now Playing
            </p>
            <Badge label="PLAYING" />
          </div>

          {/* artwork */}
          <div className="flex-1 flex flex-col items-center justify-center px-8">
            <motion.div
              animate={{ scale: isPlaying ? 1 : 0.94 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="w-full max-w-[320px] aspect-square rounded-card overflow-hidden border-4 border-br-ink/10 shadow-soft mb-6"
            >
              <img src={currentSong.artwork} alt={currentSong.title} className="w-full h-full object-cover" />
            </motion.div>

            <div className="w-full max-w-[320px] flex items-center justify-between mb-4">
              <div className="min-w-0">
                <h2 className="font-display font-extrabold text-2xl text-br-ink dark:text-white truncate">
                  {currentSong.title}
                </h2>
                <p className="text-sm font-semibold text-br-ink/50 dark:text-white/50 truncate">
                  {currentSong.artist}
                  {currentSong.featuredArtists?.length ? ` feat. ${currentSong.featuredArtists.join(', ')}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-3">
                <AudioWaveform playing={isPlaying} color="#8B7CF6" />
                <ShareButton
                  title={currentSong.title}
                  text={`Listen to ${currentSong.title} by ${currentSong.artist}`}
                  path={`/song/${currentSong.id}`}
                  size={22}
                />
                <FavoriteButton songId={currentSong.id} size={24} />
              </div>
            </div>

            {error && (
              <p className="w-full max-w-[320px] text-xs text-center text-br-pink font-semibold bg-br-pink-light rounded-xl py-2 px-3 mb-4">
                {error}
              </p>
            )}

            {/* progress */}
            <div className="w-full max-w-[320px] mb-2">
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={Math.min(currentTime, duration || 0)}
                onChange={(e) => seek(Number(e.target.value))}
                aria-label="Seek"
                disabled={!duration}
                className="w-full accent-br-purple h-1.5 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-semibold text-br-ink/40 dark:text-white/40 mt-1">
                <span>{formatDuration(currentTime)}</span>
                <span>{formatDuration(duration)}</span>
              </div>
            </div>

            {/* controls */}
            <div className="w-full max-w-[320px] flex items-center justify-between mt-4">
              <button
                onClick={toggleShuffle}
                aria-label="Toggle shuffle"
                aria-pressed={shuffle}
                className={`p-2 rounded-full ${shuffle ? 'text-br-purple' : 'text-br-ink/30 dark:text-white/30'}`}
              >
                <Shuffle size={20} />
              </button>
              <button
                onClick={goPrevious}
                aria-label="Previous song"
                className="p-2 text-br-ink dark:text-white"
              >
                <SkipBack size={26} fill="currentColor" />
              </button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggle}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="w-16 h-16 rounded-full bg-br-ink dark:bg-white flex items-center justify-center shadow-pop"
              >
                {isPlaying ? (
                  <Pause size={26} className="text-white dark:text-br-ink" fill="currentColor" />
                ) : (
                  <Play size={26} className="text-white dark:text-br-ink ml-1" fill="currentColor" />
                )}
              </motion.button>
              <button onClick={goNext} aria-label="Next song" className="p-2 text-br-ink dark:text-white">
                <SkipForward size={26} fill="currentColor" />
              </button>
              <button
                onClick={cycleRepeat}
                aria-label="Toggle repeat"
                className={`p-2 rounded-full ${repeat !== 'off' ? 'text-br-purple' : 'text-br-ink/30 dark:text-white/30'}`}
              >
                {repeat === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
              </button>
            </div>

            {/* volume */}
            <div className="w-full max-w-[320px] flex items-center gap-3 mt-8">
              <button
                onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
                aria-label={volume > 0 ? 'Mute' : 'Unmute'}
                className="text-br-ink/40 dark:text-white/40"
              >
                {volume > 0 ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                aria-label="Volume"
                className="w-full accent-br-purple h-1.5 cursor-pointer"
              />
              <button
                onClick={() => setShowQueue(true)}
                aria-label="Open queue"
                className="shrink-0 p-1 -mr-1 rounded-full text-br-ink/40 dark:text-white/40"
              >
                <ListMusic size={18} />
              </button>
            </div>
          </div>
          <QueueSheet open={showQueue} onClose={() => setShowQueue(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
