import { Search } from 'lucide-react'

export default function SearchBar({ value, onChange, onFocus, placeholder = 'Search songs, albums, playlists…', autoFocus = false }) {
  return (
    <div className="flex items-center gap-2 glass rounded-pill px-4 py-2.5">
      <Search size={18} className="text-br-ink/40 dark:text-white/40 shrink-0" />
      <input
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none text-sm font-semibold placeholder:text-br-ink/35 dark:placeholder:text-white/35 dark:text-white"
      />
    </div>
  )
}
