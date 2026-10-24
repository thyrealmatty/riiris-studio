import { Link } from 'react-router-dom'
import { useContent } from '../../context/ContentContext'

export default function TopBar({ title = 'BABYRIIRI', showAvatar = true }) {
  const { artist } = useContent()
  return (
    <div className="flex items-center justify-between px-5 pt-6 pb-4">
      <h1 className="font-display text-3xl font-extrabold text-br-ink dark:text-white tracking-tight">{title}</h1>
      {showAvatar && (
        <Link to="/profile" className="shrink-0">
          <img
            src={artist.profileImage}
            alt={artist.name}
            className="w-11 h-11 rounded-full object-cover border-2 border-br-purple shadow-sm"
          />
        </Link>
      )}
    </div>
  )
}
