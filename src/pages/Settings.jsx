import { Link } from 'react-router-dom'
import {
  ChevronRight,
  Palette,
  Trash2,
  Info,
  Sun,
  Moon,
  User,
  Download,
  CheckCircle2,
  Shield,
  Instagram,
  Youtube,
  Link2
} from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useContent } from '../context/ContentContext'
import { useInstallPrompt } from '../hooks/useInstallPrompt'

function Row({ icon: Icon, label, sub, onClick, to, href, danger, right }) {
  const content = (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${danger ? 'bg-br-pink-light' : 'bg-br-purple-light'}`}>
        <Icon size={17} className={danger ? 'text-br-pink' : 'text-br-purple-dark'} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm ${danger ? 'text-br-pink' : 'text-br-ink dark:text-white'}`}>{label}</p>
        {sub && <p className="text-xs text-br-ink/50 dark:text-white/50">{sub}</p>}
      </div>
      {right || <ChevronRight size={18} className="text-br-ink/30 dark:text-white/30" />}
    </div>
  )
  if (to) return <Link to={to}>{content}</Link>
  if (href)
    return (
      <a href={href} target="_blank" rel="noreferrer">
        {content}
      </a>
    )
  return (
    <button onClick={onClick} className="w-full text-left">
      {content}
    </button>
  )
}

function SectionCard({ title, children }) {
  return (
    <div className="px-5 mb-6">
      <p className="text-[11px] font-display font-bold tracking-widest text-br-ink/40 dark:text-white/40 uppercase mb-2 px-1">
        {title}
      </p>
      <div className="bg-white dark:bg-br-dark-soft rounded-2xl border-2 border-br-ink/10 divide-y divide-br-ink/5 overflow-hidden">
        {children}
      </div>
    </div>
  )
}

export default function Settings() {
  const { theme, setThemeMode } = useTheme()
  const { artist, clearRecents, clearFavorites } = useContent()
  const { installed, canPrompt, isIOS, install } = useInstallPrompt()
  const [iosHint, setIosHint] = useState(false)

  const socials = [
    { key: 'instagram', label: 'Instagram', icon: Instagram },
    { key: 'youtube', label: 'YouTube', icon: Youtube },
    { key: 'linktree', label: 'All links', icon: Link2 }
  ].filter((s) => artist.socials?.[s.key])

  return (
    <div className="pb-6">
      <div className="px-5 pt-6 pb-4">
        <h1 className="font-display text-3xl font-extrabold text-br-ink dark:text-white">Settings</h1>
      </div>

      <SectionCard title="Artist">
        <Row icon={User} label="BabyRiiri" sub="View artist profile" to="/profile" />
      </SectionCard>

      <SectionCard title="Appearance">
        <div className="flex items-center gap-3 px-4 py-3.5">
          <div className="w-9 h-9 rounded-xl bg-br-purple-light flex items-center justify-center">
            <Palette size={17} className="text-br-purple-dark" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-br-ink dark:text-white">Theme</p>
          </div>
          <div className="flex bg-br-purple-light rounded-pill p-1">
            <button
              onClick={() => setThemeMode('light')}
              className={`p-1.5 rounded-pill ${theme === 'light' ? 'bg-white shadow-sm' : ''}`}
              aria-label="Light mode"
              aria-pressed={theme === 'light'}
            >
              <Sun size={14} className="text-br-purple-dark" />
            </button>
            <button
              onClick={() => setThemeMode('dark')}
              className={`p-1.5 rounded-pill ${theme === 'dark' ? 'bg-white shadow-sm' : ''}`}
              aria-label="Dark mode"
              aria-pressed={theme === 'dark'}
            >
              <Moon size={14} className="text-br-purple-dark" />
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="App">
        {installed ? (
          <Row
            icon={CheckCircle2}
            label="BabyRiiri is installed"
            sub="You're using the app"
            right={<span />}
            onClick={() => {}}
          />
        ) : canPrompt ? (
          <Row icon={Download} label="Install BabyRiiri" sub="Add the app to your home screen" onClick={install} />
        ) : isIOS ? (
          <Row
            icon={Download}
            label="Install BabyRiiri"
            sub={iosHint ? 'In Safari tap Share, then “Add to Home Screen”' : 'Tap for steps'}
            onClick={() => setIosHint((v) => !v)}
          />
        ) : (
          <Row
            icon={Download}
            label="Install BabyRiiri"
            sub="Use your browser menu → Install app / Add to Home Screen"
            right={<span />}
            onClick={() => {}}
          />
        )}
      </SectionCard>

      <SectionCard title="Your listening data">
        <Row
          icon={Trash2}
          label="Clear recently played"
          sub="Stored only on this device"
          onClick={() => {
            if (confirm('Clear your recently played list on this device?')) clearRecents()
          }}
        />
        <Row
          icon={Trash2}
          label="Clear favorites"
          sub="Removes your hearted songs on this device"
          danger
          onClick={() => {
            if (confirm('Remove all your favorite songs on this device?')) clearFavorites()
          }}
        />
      </SectionCard>

      {socials.length > 0 && (
        <SectionCard title="Follow BabyRiiri">
          {socials.map(({ key, label, icon }) => (
            <Row key={key} icon={icon} label={label} sub="Opens in a new tab" href={artist.socials[key]} />
          ))}
        </SectionCard>
      )}

      <SectionCard title="About">
        <div className="flex items-center gap-3 px-4 py-3.5">
          <div className="w-9 h-9 rounded-xl bg-br-purple-light flex items-center justify-center">
            <Info size={17} className="text-br-purple-dark" />
          </div>
          <div>
            <p className="font-semibold text-sm text-br-ink dark:text-white">BabyRiiri</p>
            <p className="text-xs text-br-ink/50 dark:text-white/50">Version 2.0.0 · Official music app</p>
          </div>
        </div>
        <div className="flex items-start gap-3 px-4 py-3.5">
          <div className="w-9 h-9 rounded-xl bg-br-purple-light flex items-center justify-center shrink-0">
            <Shield size={17} className="text-br-purple-dark" />
          </div>
          <p className="text-xs text-br-ink/60 dark:text-white/60 leading-relaxed">
            Your favorites, recently played songs and queue are saved only on this device. BabyRiiri doesn’t ask for
            accounts or personal details.
          </p>
        </div>
      </SectionCard>
    </div>
  )
}
