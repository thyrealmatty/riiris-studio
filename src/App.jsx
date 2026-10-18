import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { ContentProvider } from './context/ContentContext'
import { PlayerProvider } from './context/PlayerContext'

import BottomNav from './components/navigation/BottomNav'
import MiniPlayer from './components/player/MiniPlayer'
import MusicPlayer from './components/player/MusicPlayer'
import Toast from './components/ui/Toast'

import Home from './pages/Home'
import Library from './pages/Library'
import Explore from './pages/Explore'
import Search from './pages/Search'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Song from './pages/Song'
import Album from './pages/Album'
import Playlist from './pages/Playlist'

// Scrolls to top on every route change so navigating never leaves the
// user stranded halfway down the previous page.
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/**
 * The public app. Visitors can listen, search, browse and keep personal
 * favorites — there are no editing, upload, import or admin routes here.
 * (Content is managed through the separate, login-protected /admin panel.)
 */
function AppShell() {
  return (
    <div className="min-h-screen bg-br-cream dark:bg-br-dark transition-colors">
      <ScrollToTop />
      <div className="max-w-lg mx-auto min-h-screen relative pb-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/song/:id" element={<Song />} />
          <Route path="/album/:id" element={<Album />} />
          <Route path="/playlist/:id" element={<Playlist />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>

      <MiniPlayer />
      <MusicPlayer />
      <Toast />
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <ContentProvider>
        <PlayerProvider>
          <AppShell />
        </PlayerProvider>
      </ContentProvider>
    </ThemeProvider>
  )
}
