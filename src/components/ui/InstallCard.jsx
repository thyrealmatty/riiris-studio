import { useState } from 'react'
import { Download, Share, X } from 'lucide-react'
import { useInstallPrompt } from '../../hooks/useInstallPrompt'

/** Friendly "install BabyRiiri" card for the homepage. Hides itself when it can't help. */
export default function InstallCard() {
  const { canOffer, canPrompt, isIOS, dismissed, install, dismiss } = useInstallPrompt()
  const [showSteps, setShowSteps] = useState(false)

  if (!canOffer || dismissed) return null

  return (
    <section className="px-5 mb-8">
      <div className="relative rounded-card border-2 border-br-ink/10 bg-br-pink-light shadow-soft p-4 pr-10">
        <button onClick={dismiss} aria-label="Dismiss" className="absolute top-3 right-3 p-1 rounded-full">
          <X size={16} className="text-br-ink/50" />
        </button>
        <p className="font-display font-extrabold text-br-ink leading-tight">Keep BabyRiiri on your home screen</p>
        <p className="text-xs text-br-ink/60 mt-1">Install the app for one-tap listening, full-screen player and offline-friendly loading.</p>

        {canPrompt && (
          <button
            onClick={install}
            className="mt-3 inline-flex items-center gap-2 bg-br-purple text-white font-display font-bold text-sm px-4 py-2 rounded-pill shadow-sm active:scale-95 transition-transform"
          >
            <Download size={16} /> Install app
          </button>
        )}

        {!canPrompt && isIOS && (
          <>
            <button
              onClick={() => setShowSteps((s) => !s)}
              className="mt-3 inline-flex items-center gap-2 bg-br-purple text-white font-display font-bold text-sm px-4 py-2 rounded-pill shadow-sm active:scale-95 transition-transform"
            >
              <Download size={16} /> How to install
            </button>
            {showSteps && (
              <p className="text-xs text-br-ink/70 mt-3 leading-relaxed">
                In Safari, tap <Share size={12} className="inline -mt-0.5" /> <b>Share</b>, then <b>Add to Home Screen</b>.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  )
}
