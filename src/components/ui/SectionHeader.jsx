import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function SectionHeader({ title, actionLabel, actionTo, onAction }) {
  return (
    <div className="flex items-end justify-between px-5 mb-3">
      <h2 className="font-display text-xl font-bold text-br-ink dark:text-white">{title}</h2>
      {actionTo ? (
        <Link
          to={actionTo}
          className="flex items-center gap-0.5 text-sm font-semibold text-br-purple-dark hover:text-br-purple"
        >
          {actionLabel || 'See all'} <ChevronRight size={16} />
        </Link>
      ) : onAction ? (
        <button
          onClick={onAction}
          className="flex items-center gap-0.5 text-sm font-semibold text-br-purple-dark hover:text-br-purple"
        >
          {actionLabel || 'See all'} <ChevronRight size={16} />
        </button>
      ) : null}
    </div>
  )
}
