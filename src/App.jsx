import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router'

import './App.css'
import PlayerBar from './components/PlayerBar.jsx'
import Sidebar from './components/Sidebar.jsx'

const Home = lazy(() => import('./pages/Home.jsx'))
const Explore = lazy(() => import('./pages/Explore.jsx'))
const Library = lazy(() => import('./pages/Library.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))
const NotFoundPage = lazy(() => import('./pages/404.jsx'))

function App() {

  return (
    <>
      <Sidebar />
      <Suspense fallback={<div>Loading...</div>} >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/library" element={<Library />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense >
      <PlayerBar />
    </>
  )
}

export default App