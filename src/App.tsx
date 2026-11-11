import { useEffect, useState } from 'react'
import './App.css'
import logo from './assets/logo.png'
import About from './pages/About.tsx'
import Apps from './pages/Apps.tsx'
import Games from './pages/Games.tsx'
import Home from './pages/Home.tsx'
import ImageToPdf from './pages/ImageToPdf.tsx'


type Page = 'home' | 'apps' | 'games' | 'about' | 'image-to-pdf'


function pageFromPath(pathname: string): Page {
  if (pathname === '/image-to-pdf') return 'image-to-pdf'
  if (pathname === '/apps') return 'apps'
  if (pathname === '/games') return 'games'
  if (pathname === '/about') return 'about'
  return 'home'
}


const navigation: { page: Page; label: string }[] = [
  { page: 'home', label: 'Home' },
  { page: 'apps', label: 'Apps' },
  { page: 'games', label: 'Games' },
  { page: 'about', label: 'About' },
]


function NavigationIcon({ name }: { name: Page }) {
  if (name === 'home') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z" /></svg>
  }
  if (name === 'apps') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h5v5H3zm6.5 0h5v5h-5zM16 3h5v5h-5zM3 9.5h5v5H3zm6.5 0h5v5h-5zm6.5 0h5v5h-5zM3 16h5v5H3zm6.5 0h5v5h-5zm6.5 0h5v5h-5z" /></svg>
  }
  if (name === 'games') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 7.5A3.5 3.5 0 0 1 11.5 4h1A3.5 3.5 0 0 1 16 7.5v.3a3 3 0 0 1 1.8 2.8L18 16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2l.2-5.4A3 3 0 0 1 8 7.8v-.3Zm2.5 4.5h3a1 1 0 0 0 0-2h-1V8.5a1 1 0 1 0-2 0v1h-1a1 1 0 0 0 0 2h1v1a1 1 0 1 0 2 0v-1Zm5 5.5h.5a1.5 1.5 0 0 0 1.5-1.5v-.5h-2v2Zm-10 0v-2H4v.5A1.5 1.5 0 0 0 5.5 18H6Z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M9.8 9a2.3 2.3 0 1 1 3.9 1.7c-1.1 1-1.7 1.3-1.7 2.8M12 17.2v.1" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  )
}


function App() {
  const [page, setPage] = useState<Page>(() => pageFromPath(window.location.pathname))


  useEffect(() => {
    const handlePopState = () => setPage(pageFromPath(window.location.pathname))
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])


  const navigate = (target: Page) => {
    const path = target === 'home' ? '/' : `/${target}`
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path)
    }
    setPage(target)
  }


  return (
    <div className="orange-site">
      <header className="site-header">
        <nav className="site-nav" aria-label="Main navigation">
          <button
            aria-label="Go to home"
            className="nav-logo"
            onClick={() => navigate('home')}
            type="button"
          >
            <img src={logo} alt="Orange Apps logo" />
          </button>
          {navigation.map(({ page: target, label }) => (
            <button
              aria-current={page === target || (target === 'apps' && page === 'image-to-pdf') ? 'page' : undefined}
              className={`nav-link${page === target || (target === 'apps' && page === 'image-to-pdf') ? ' active' : ''}`}
              key={target}
              onClick={() => navigate(target)}
            >
              <NavigationIcon name={target} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </header>
      <main className="site-content">
        {page === 'home' && <Home onApps={() => navigate('apps')} />}
        {page === 'apps' && <Apps onOpenImageToPdf={() => navigate('image-to-pdf')} />}
        {page === 'games' && <Games />}
        {page === 'about' && <About />}
        {page === 'image-to-pdf' && <ImageToPdf />}
      </main>
      <footer className="site-footer">
        <span className="footer-brand"><img src="/favicon.png" alt="" /> orangeapps.in</span>
        <span>Your Ideas. Our Web Solutions.</span>
      </footer>
    </div>
  )
}


export default App