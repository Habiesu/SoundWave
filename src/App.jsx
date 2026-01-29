import { lazy, Suspense, useState, useContext } from 'react'
import { Routes, Route } from 'react-router'

import './App.css'
import PlayerBar from './components/PlayerBar.jsx'
import Sidebar from './components/Sidebar.jsx'
import Header from './components/Header.jsx'
import { AudioContext } from './context/AudioContext'

const Home = lazy(() => import('./pages/Home.jsx'))
const Explore = lazy(() => import('./pages/Explore.jsx'))
const Library = lazy(() => import('./pages/Library.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))
const PlaylistDetail = lazy(() => import('./pages/PlaylistDetail.jsx'))
const PlaylistsPage = lazy(() => import('./pages/Playlists.jsx'))
const NotFoundPage = lazy(() => import('./pages/404.jsx'))

function App() {
  const { currentSong } = useContext(AudioContext)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // Estado para el menú
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <div className={`app-layout ${currentSong ? 'has-player' : ''}`}>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="main-viewport">
        <Header onMenuClick={toggleSidebar} />

        <Suspense fallback={<div className="loading">Cargando...</div>} >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/library" element={<Library />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/playlists" element={<PlaylistsPage />} />
            <Route path="/playlists/:slug" element={<PlaylistDetail />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense >
      </div>

      <PlayerBar />
    </div>
  )
}

export default App