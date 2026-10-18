import { Link } from 'react-router-dom'
import { Home, Music, User } from 'lucide-react'
import Badge from '../ui/Badge'

export default function ArtistCard({ artist }) {
  return (
    <Link
      to="/profile"
      className="block w-[220px] shrink-0 rounded-card border-2 border-br-ink/10 shadow-soft bg-white dark:bg-br-dark-soft overflow-hidden relative"
    >
      {artist.badge && <Badge label={artist.badge} className="absolute top-3 right-3 z-10" />}
      <div className="flex flex-col items-center pt-6 pb-4 px-4">
        <img
          src={artist.profileImage}
          alt={artist.name}
          className="w-20 h-20 rounded-full object-cover border-4 border-br-purple-light shadow-md"
        />
        <p className="font-display font-extrabold text-lg mt-2 text-br-ink dark:text-white">{artist.name}</p>
        <p className="text-xs text-br-ink/50 dark:text-white/50">{artist.followers} Followers</p>
      </div>
      <div className="flex justify-around border-t border-br-ink/10 py-2.5">
        <Home size={16} className="text-br-ink/40" />
        <Music size={16} className="text-br-ink/40" />
        <User size={16} className="text-br-purple" />
      </div>
    </Link>
  )
}
