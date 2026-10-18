import { useCallback, useEffect, useState } from 'react'
import { dismissInstall, isInstallDismissed } from '../utils/storage'

const isStandalone = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true)

const isIOS = () =>
  typeof navigator !== 'undefined' &&
  /iphone|ipad|ipod/i.test(navigator.userAgent) &&
  !window.MSStream

/**
 * PWA install helper.
 * - Chrome/Edge/Android: captures `beforeinstallprompt` (stashed early in main.jsx) and can trigger it.
 * - iOS Safari: there's no prompt API, so we expose `isIOS` to show "Share → Add to Home Screen" steps.
 */
export function useInstallPrompt() {
  const [deferred, setDeferred] = useState(() => (typeof window !== 'undefined' ? window.__babyriiriInstallEvent || null : null))
  const [installed, setInstalled] = useState(isStandalone)
  const [dismissed, setDismissed] = useState(isInstallDismissed)

  useEffect(() => {
    const onReady = () => setDeferred(window.__babyriiriInstallEvent || null)
    const onInstalled = () => {
      setInstalled(true)
      setDeferred(null)
    }
    window.addEventListener('babyriiri:installable', onReady)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('babyriiri:installable', onReady)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const install = useCallback(async () => {
    if (!deferred) return false
    deferred.prompt()
    const { outcome } = await deferred.userChoice
    window.__babyriiriInstallEvent = null
    setDeferred(null)
    return outcome === 'accepted'
  }, [deferred])

  const dismiss = useCallback(() => {
    dismissInstall()
    setDismissed(true)
  }, [])

  const ios = isIOS()
  return {
    installed,
    canPrompt: Boolean(deferred),
    isIOS: ios,
    // Only offer when installing is actually possible and wanted.
    canOffer: !installed && (Boolean(deferred) || ios),
    dismissed,
    install,
    dismiss
  }
}
