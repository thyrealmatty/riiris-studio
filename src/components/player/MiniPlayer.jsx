import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause } from 'lucide-react'
import { usePlayer } from '../../context/PlayerContext'
import AudioWaveform from './AudioWaveform'

export default function MiniPlayer() {
  const { currentSong, isPlaying, toggle, setIsPlayerOpen, isPlayerOpen, currentTime, duration } = usePlayer()

  if (!currentSong || isPlayerOpen) return null
  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <AnimatePresence>
      <motion.button
        key="mini-player"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        onClick={() => setIsPlayerOpen(true)}
        className="fixed left-2 right-2 max-w-lg mx-auto z-40 mini-glass rounded-2xl overflow-hidden text-left"
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 72px)' }}
        aria-label={`Open player — ${currentSong.title}`}
      >
        <div className="flex items-center gap-3 px-3 py-2.5">
          <img
            src={currentSong.artwork}
            alt=""
            className={`w-10 h-10 rounded-xl object-cover shrink-0 ${isPlaying ? "mini-art-live" : ""}`}
          />
          <div className="min-w-0 flex-1">
            <p className="font-display font-bold text-sm text-white dark:text-br-ink truncate">
              {currentSong.title}
            </p>
            <p className="text-xs text-white/60 dark:text-br-ink/60 truncate">{currentSong.artist}</p>
          </div>
          <AudioWaveform playing={isPlaying} color="#FF9FC7" size="sm" />
          <motion.span
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.stopPropagation()
              toggle()
            }}
            className="w-9 h-9 rounded-full bg-white dark:bg-br-ink play-pulse flex items-center justify-center shrink-0"
          >
            {isPlaying ? (
              <Pause size={16} className="text-br-ink dark:text-white" fill="currentColor" />
            ) : (
              <Play size={16} className="text-br-ink dark:text-white ml-0.5" fill="currentColor" />
            )}
          </motion.span>
        </div>
        <div className="h-1 bg-white/10 dark:bg-br-ink/10">
          <div className="h-full mini-progress transition-all" style={{ width: `${progress}%` }} />
        </div>
      </motion.button>
    </AnimatePresence>
  )
}
