import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loadPrefs, savePrefs } from '../utils/storage'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [prefs, setPrefs] = useState(() => loadPrefs())

  useEffect(() => {
    const root = document.documentElement
    if (prefs.theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [prefs.theme])

  useEffect(() => {
    savePrefs(prefs)
  }, [prefs])

  const setThemeMode = (mode) => setPrefs((p) => ({ ...p, theme: mode }))
  const setAccent = (accent) => setPrefs((p) => ({ ...p, accent }))
  const setVolume = (volume) => setPrefs((p) => ({ ...p, volume }))

  const value = useMemo(
    () => ({ ...prefs, setThemeMode, setAccent, setVolume }),
    [prefs]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
