import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { purgeLegacyData } from './utils/storage'
import './index.css'

// Remove any catalogue copy an older build stored on this device.
purgeLegacyData()

// Chrome/Edge/Android fire this once, early. Stash it so the install card can use it later.
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  window.__babyriiriInstallEvent = e
  window.dispatchEvent(new Event('babyriiri:installable'))
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

// Offline support + installability (production only; the SW is generated at build time).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  import('virtual:pwa-register').then(({ registerSW }) => registerSW({ immediate: true })).catch((err) => {
    console.warn('BabyRiiri: service worker registration failed', err)
  })
}
