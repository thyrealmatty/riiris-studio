import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { usePlayer } from '../../context/PlayerContext'
import { useContent } from '../../context/ContentContext'
import AudioWaveform from './AudioWaveform'

// "Up next" bottom sheet opened from the full-screen player.
export default function QueueSheet({ open, onClose }) {
  const { queue, queueIndex, jumpTo, isPlaying } = usePlayer()
  const { getSong } = useContent()
  const songs = queue.map(getSong).filter(Boolean)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-br-ink/40 z-10"
          />
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className="absolute left-0 right-0 bottom-0 z-20 max-h-[70%] flex flex-col glass-sheet rounded-t-card"
            role="dialog"
            aria-label="Up next"
          >
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <h3 className="font-display font-extrabold text-lg text-br-ink dark:text-white">Up next</h3>
              <button onClick={onClose} aria-label="Close queue" className="p-2 -mr-2 rounded-full hover:bg-br-purple-light">
                <X size={20} className="text-br-ink dark:text-white" />
              </button>
            </div>
            <ul className="overflow-y-auto px-3 pb-6">
              {songs.map((song, i) => {
                const current = i === queueIndex
                return (
                  <li key={`${song.id}-${i}`}>
                    <button
                      onClick={() => {
                        jumpTo(i)
                        onClose()
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-left ${
                        current ? 'bg-br-purple-light dark:bg-br-dark-soft' : 'hover:bg-br-purple-light/50 dark:hover:bg-white/5'
                      }`}
                    >
                      <img src={song.artwork} alt="" className="w-10 h-10 rounded-xl object-cover border border-br-ink/10" />
                      <div className="min-w-0 flex-1">
                        <p className={`font-display font-bold text-sm truncate ${current ? 'text-br-purple-dark' : 'text-br-ink dark:text-white'}`}>
                          {song.title}
                        </p>
                        <p className="text-xs text-br-ink/50 dark:text-white/50 truncate">{song.artist}</p>
                      </div>
                      {current ? (
                        <AudioWaveform playing={isPlaying} color="#8B7CF6" size="sm" />
                      ) : (
                        <span className="text-xs font-semibold text-br-ink/30 dark:text-white/30">{i + 1}</span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
