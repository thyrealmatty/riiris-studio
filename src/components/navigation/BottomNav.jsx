import { NavLink } from 'react-router-dom'
import { Home, Library, Compass, User } from 'lucide-react'

const ITEMS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/library', label: 'Library', icon: Library },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/profile', label: 'Profile', icon: User }
]

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-br-dark/95 backdrop-blur border-t-2 border-br-ink/10"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="max-w-lg mx-auto flex items-stretch justify-around px-2">
        {ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2.5 px-4 flex-1 transition-colors ${
                isActive ? 'text-br-purple-dark' : 'text-br-ink/40 dark:text-white/40'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
                    isActive ? 'bg-br-purple-light' : ''
                  }`}
                >
                  <Icon size={20} strokeWidth={2.4} />
                </span>
                <span className="text-[10px] font-display font-bold">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
