import { Music2 } from 'lucide-react'

export default function EmptyState({ title = 'Nothing here yet', subtitle, icon: Icon = Music2 }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <div className="w-20 h-20 rounded-full bg-br-purple-light flex items-center justify-center mb-4 border-2 border-br-ink/10">
        <Icon size={32} className="text-br-purple-dark" strokeWidth={2} />
      </div>
      <p className="font-display font-bold text-lg text-br-ink dark:text-white">{title}</p>
      {subtitle && <p className="text-sm text-br-ink/50 dark:text-white/50 mt-1 max-w-xs">{subtitle}</p>}
    </div>
  )
}
