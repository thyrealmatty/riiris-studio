import { AnimatePresence, motion } from 'framer-motion'
import { usePlayer } from '../../context/PlayerContext'

// Small pill that floats above the mini-player. Driven by the player's `notice`.
export default function Toast() {
  const { notice } = usePlayer()
  return (
    <div
      className="fixed left-0 right-0 z-[60] flex justify-center px-4 pointer-events-none"
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 140px)' }}
      role="status"
      aria-live="polite"
    >
      <AnimatePresence>
        {notice && (
          <motion.div
            key={notice}
            initial={{ y: 16, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 320 }}
            className="max-w-sm mini-glass text-white dark:text-br-ink text-sm font-semibold font-display px-4 py-2.5 rounded-pill shadow-soft text-center"
          >
            {notice}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
