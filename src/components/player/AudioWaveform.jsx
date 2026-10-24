import { motion } from 'framer-motion'

const BAR_COUNT = 5

export default function AudioWaveform({ playing = false, color = 'currentColor', size = 'md' }) {
  const heights = size === 'sm' ? [6, 10, 5, 12, 7] : [10, 18, 8, 22, 12]
  const barWidth = size === 'sm' ? 2 : 3

  return (
    <div className="flex items-end gap-[3px] h-[22px]" aria-hidden="true">
      {heights.map((h, i) => (
        <motion.span
          key={i}
          style={{ width: barWidth, backgroundColor: color, borderRadius: 2 }}
          animate={
            playing
              ? { height: [h * 0.4, h, h * 0.5, h * 0.9, h * 0.4] }
              : { height: h * 0.3 }
          }
          transition={
            playing
              ? { duration: 0.9 + i * 0.1, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.2 }
          }
        />
      ))}
    </div>
  )
}
