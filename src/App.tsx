import { useEffect, useState } from 'react'
import './App.css'
import logo from './assets/logo.png'
import About from './pages/About.tsx'
import Apps from './pages/Apps.tsx'
import EndlessRunner from './pages/EndlessRunner.tsx'
import Games from './pages/Games.tsx'
import Home from './pages/Home.tsx'
import ImageToPdf from './pages/ImageToPdf.tsx'


type Page = 'home' | 'apps' | 'games' | 'about' | 'image-to-pdf' | 'endless-runner'


function pageFromPath(pathname: string): Page {
  if (pathname === '/image-to-pdf') return 'image-to-pdf'
  if (pathname === '/endless-runner') return 'endless-runner'
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
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
          <circle cx="12" cy="5" r="2" fill="currentColor" stroke="none" />
          <path d="M12 7v5m-2-3h4M6 13h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2Z" />
          <path d="M8 15v2m-1-1h2m7 0h.01m2 0h.01" />
        </g>
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
    <div className={`orange-site${page === 'endless-runner' ? ' runner-mode' : ''}`}>
      <header className="site-header">
        <nav className="site-nav" aria-label="Main navigation">
          {navigation.map(({ page: target, label }) => (
            <button
              aria-current={page === target || (target === 'apps' && page === 'image-to-pdf') || (target === 'games' && page === 'endless-runner') ? 'page' : undefined}
              className={`nav-link${target === 'home' ? ' nav-link-home' : ''}${page === target || (target === 'apps' && page === 'image-to-pdf') || (target === 'games' && page === 'endless-runner') ? ' active' : ''}`}
              key={target}
              onClick={() => navigate(target)}
              type="button"
            >
              {target === 'home' ? <img src={logo} alt="" /> : <NavigationIcon name={target} />}
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </header>
      <main className="site-content">
        {page === 'home' && <Home onApps={() => navigate('apps')} />}
        {page === 'apps' && <Apps onOpenImageToPdf={() => navigate('image-to-pdf')} />}
        {page === 'games' && <Games onOpenEndlessRunner={() => navigate('endless-runner')} />}
        {page === 'about' && <About />}
        {page === 'image-to-pdf' && <ImageToPdf />}
        {page === 'endless-runner' && <EndlessRunner onExit={() => navigate('games')} />}
      </main>
      <footer className="site-footer">
        <span className="footer-brand"><img src="/favicon.png" alt="" /> orangeapps.in</span>
        <span>Your Ideas. Our Web Solutions.</span>
      </footer>
    </div>
  )
}


export default App