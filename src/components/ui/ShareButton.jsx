import { useState } from 'react'
import { Share2, Check } from 'lucide-react'

/** Shares a link with the native share sheet, or copies it as a fallback. */
export default function ShareButton({ title, text, path, size = 20, className = '' }) {
  const [copied, setCopied] = useState(false)

  const share = async (e) => {
    e?.stopPropagation()
    const url = new URL(path || '/', window.location.origin).toString()
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* user cancelled the share sheet — nothing to do */
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      aria-label={copied ? 'Link copied' : `Share ${title}`}
      className={`inline-flex items-center justify-center rounded-full p-1 ${className}`}
    >
      {copied ? (
        <Check size={size} className="text-br-purple" />
      ) : (
        <Share2 size={size} className="text-br-ink/40 dark:text-white/40" />
      )}
    </button>
  )
}
