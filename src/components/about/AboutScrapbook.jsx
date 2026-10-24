import { Link } from 'react-router-dom'
import { motion, MotionConfig } from 'framer-motion'
import { Play, ArrowUpRight, Instagram, Youtube, Link2 } from 'lucide-react'
import { useContent } from '../../context/ContentContext'
import { usePlayer } from '../../context/PlayerContext'
import { formatDate } from '../../utils/format'

const spring = { type: 'spring', stiffness: 240, damping: 16 }
const inView = { once: true, margin: '-40px' }

const Sparkle = ({ className = '', color = '#F2C14E', size = 22 }) => (
  <svg className={`sparkle ${className}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <path d="M12 0C13 7 17 11 24 12 17 13 13 17 12 24 11 17 7 13 0 12 7 11 11 7 12 0Z" fill={color} />
  </svg>
)
const Flower = ({ className = '', size = 30 }) => (
  <svg className={`spin-slow ${className}`} width={size} height={size} viewBox="0 0 40 40" aria-hidden>
    {[0, 60, 120, 180, 240, 300].map((r) => (
      <ellipse key={r} cx="20" cy="9" rx="5.5" ry="9" fill="#FF5D9E" transform={`rotate(${r} 20 20)`} />
    ))}
    <circle cx="20" cy="20" r="5" fill="#F2C14E" />
  </svg>
)
const Squiggle = ({ className = '' }) => (
  <svg className={className} width="90" height="14" viewBox="0 0 90 14" fill="none" aria-hidden>
    <path d="M2 8c8-10 14 6 22-2s14 6 22-2 14 6 22-2 14 4 20 0" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
)
const Arrow = ({ className = '' }) => (
  <svg className={className} width="34" height="30" viewBox="0 0 34 30" fill="none" aria-hidden>
    <path d="M3 27C6 14 16 6 29 4M29 4l-8-2M29 4l-4 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function Sticker({ children, className = '', rotate = 0, delay = 0 }) {
  return (
    <motion.span
      initial={{ scale: 0, rotate: rotate - 30, opacity: 0 }}
      whileInView={{ scale: 1, rotate, opacity: 1 }}
      viewport={inView}
      transition={{ ...spring, delay }}
      whileHover={{ rotate: rotate + 5, scale: 1.1 }}
      className={`sticker ${className}`}
    >
      {children}
    </motion.span>
  )
}

function Polaroid({ src, caption, rotate, delay = 0 }) {
  return (
    <motion.figure
      initial={{ y: 50, opacity: 0, rotate: rotate * 3 }}
      whileInView={{ y: 0, opacity: 1, rotate }}
      viewport={inView}
      transition={{ ...spring, delay }}
      whileHover={{ rotate: 0, scale: 1.05, y: -8 }}
      className="polaroid"
    >
      <i className="tape tape-a" />
      <i className="tape tape-b" />
      <img src={src} alt={caption} loading="lazy" />
      <figcaption>{caption}</figcaption>
    </motion.figure>
  )
}

const tones = ['ink', 'sun', 'sky']

export default function AboutScrapbook() {
  const { artist, songs } = useContent()
  const { playQueue } = usePlayer()
  const name = (artist.name || 'BabyRiiri').toUpperCase()
  const drops = songs.slice(0, 3)
  const roles = ['Singer', 'Rapper', 'Songwriter', ...(artist.genres || [])]
  const chipTone = ['blue', 'pink', 'green', 'sun', 'pink']
  const socials = [
    { k: 'instagram', label: 'Instagram', Icon: Instagram },
    { k: 'youtube', label: 'YouTube', Icon: Youtube },
    { k: 'linktree', label: 'All links', Icon: Link2 }
  ].filter((s) => artist.socials?.[s.k])

  return (
    <MotionConfig reducedMotion="user">
      <div className="paper">
        <Sparkle className="d1" size={20} />
        <Sparkle className="d2" color="#FF5D9E" size={14} />
        <Sparkle className="d3" color="#2B4BE2" size={16} />
        <Flower className="d4" size={26} />

        {/* ---------- name plate ---------- */}
        <header className="hero">
          <p className="hand small">my name is</p>
          <Squiggle className="mx-auto text-br-ink/50 dark:text-white/50" />
          <div className="nameplate">
            <svg className="frame" viewBox="0 0 300 110" preserveAspectRatio="none" aria-hidden>
              <motion.path
                d="M6 10C80 4 200 8 292 5 296 40 294 70 291 102 200 108 90 104 8 106 3 70 5 40 6 10Z"
                fill="none" stroke="#F26B3A" strokeWidth="2.6" strokeLinejoin="round"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={inView}
                transition={{ duration: 1.4, ease: 'easeInOut' }}
              />
            </svg>
            <h1 className="pixel" aria-label={artist.name}>
              {[...name].map((ch, i) => (
                <motion.span key={i} initial={{ y: 26, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={inView}
                  transition={{ ...spring, delay: 0.25 + i * 0.05 }}>{ch}</motion.span>
              ))}
            </h1>
            <Sticker className="st-green tl" rotate={-6} delay={0.5}>MADE WITH LOVE</Sticker>
            <Sticker className="st-yellow tr" rotate={5} delay={0.6}>ALWAYS HOPEFUL</Sticker>
            <Sticker className="tag-yellow bl" rotate={-3} delay={0.7}>Singer &amp; Rapper</Sticker>
            {artist.hometown && <Sticker className="tag-green br" rotate={3} delay={0.8}>{artist.hometown}</Sticker>}
            <Arrow className="ar-l" />
            <Arrow className="ar-r" />
          </div>
          <p className="status"><i /> NEW MUSIC, ALWAYS COMING</p>

          <div className="headline-wrap">
            <img className="avatar a-l" src={artist.profileImage} alt="" />
            <img className="avatar a-r" src={artist.profileImage} alt="" />
            <h2 className="headline">
              {artist.tagline || 'Music that lifts you up.'} <Flower size={22} className="inline-flower" />
            </h2>
          </div>
          <button className="cta" onClick={() => playQueue(songs.map((s) => s.id))} disabled={!songs.length}>
            <span className="cta-ic"><Play size={11} fill="currentColor" /></span> LISTEN NOW
          </button>
        </header>

        <svg className="arc" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden>
          <path d="M0 30C120 -6 280 -6 400 28" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
        <p className="hand about-me">about me!</p>

        {/* ---------- what's up ---------- */}
        <section className="whatsup">
          <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={inView} className="boxed hand">what's up</motion.span>
          <div className="polaroids">
            <Polaroid src={artist.profileImage} caption={artist.name} rotate={-5} />
            <Polaroid src={artist.heroImage || artist.profileImage} caption="my world ✦" rotate={4} delay={0.12} />
          </div>
          <motion.p className="hand bio" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={inView} transition={{ duration: 0.7 }}>
            {artist.bio} ✨
          </motion.p>
          <div className="chips">
            {roles.slice(0, 8).map((r, i) => (
              <Sticker key={r} className={`torn ${chipTone[i % chipTone.length]}`} rotate={i % 2 ? 2 : -2} delay={i * 0.06}>{r}</Sticker>
            ))}
          </div>
        </section>

        {/* ---------- latest drops ---------- */}
        {drops.length > 0 && (
          <section className="drops">
            <p className="mono label">LATEST DROPS</p>
            {drops.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={inView} transition={{ ...spring, delay: 0.05 }}>
                <Link to={`/song/${s.id}`} className={`drop ${tones[i % 3]}`}>
                  <span className="drop-tab mono">✦ SONG 0{i + 1}</span>
                  <div className="drop-body">
                    <div className="min-w-0">
                      <p className="mono drop-date">● {s.releaseDate ? formatDate(s.releaseDate) : s.hasAudio ? 'OUT NOW' : 'COMING SOON'}</p>
                      <h3>{s.title}</h3>
                      <p className="drop-sub">{s.artist}{s.featuredArtists?.length ? ` feat. ${s.featuredArtists.join(', ')}` : ''}</p>
                      <span className="mono view">VIEW SONG <ArrowUpRight size={12} /></span>
                    </div>
                    <div className="drop-art"><i className="tape tape-a" /><img src={s.artwork} alt="" loading="lazy" /></div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </section>
        )}

        {socials.length > 0 && (
          <footer className="follow">
            <p className="hand">find me online</p>
            <div>
              {socials.map(({ k, label, Icon }) => (
                <a key={k} href={artist.socials[k]} target="_blank" rel="noreferrer" className="brut mono"><Icon size={14} /> {label}</a>
              ))}
            </div>
          </footer>
        )}
      </div>
    </MotionConfig>
  )
}
