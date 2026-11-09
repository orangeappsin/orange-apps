import { useState } from 'react'
import About from './About.tsx'
import Contactus from './Contactus.tsx'
import './Home.css'

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path className="icon-cutout" d="M11 10h2v7h-2zm0-4h2v2h-2z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 8L3 7v2l9 6 9-6V7z" />
    </svg>
  )
}

function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 220 170" role="img" aria-label="Orange Apps logo">
      <path
        className="brand-swoosh"
        d="M25 121C4 121 18 98 62 75 28 99 24 112 39 112c30 0 99-36 107-57 3-8-4-13-20-13 22-4 38 3 35 17-5 25-92 62-136 62Z"
      />
      <path
        className="brand-a"
        d="M89 25c3-8 9-12 18-12h12c8 0 14 4 18 12l54 119h-47l-16-38-27-51-25 51-15 38H15L89 25Zm28 45 14 29h-29l15-29Z"
      />
      <path className="brand-square" d="M174 17h13v13h-13zM192 4h13v13h-13zM194 26h8v8h-8zM161 34h10v10h-10zM177 39h9v9h-9zM190 48h7v7h-7z" />
    </svg>
  )
}

function HeroArtwork() {
  return (
    <svg
      className="hero-artwork"
      viewBox="0 0 600 400"
      role="img"
      aria-label="A laptop displaying a modern website, surrounded by creative tools"
    >
      <defs>
        <linearGradient id="screen" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#f9fcff" />
          <stop offset="1" stopColor="#e9f1fb" />
        </linearGradient>
        <linearGradient id="laptop" x1="0" x2="0.9" y1="0" y2="1">
          <stop offset="0" stopColor="#a9c2e8" />
          <stop offset="0.5" stopColor="#536c91" />
          <stop offset="1" stopColor="#263c5c" />
        </linearGradient>
        <linearGradient id="blue-tile" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#65aaff" />
          <stop offset="1" stopColor="#2874eb" />
        </linearGradient>
        <filter id="tile-shadow" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#33496a" floodOpacity=".2" />
        </filter>
      </defs>

      <ellipse cx="324" cy="357" rx="245" ry="15" fill="#e4b986" opacity=".23" />

      <g className="plant">
        <path d="M133 300c-3-42-21-66-43-79 0 37 15 64 43 79Z" fill="#3ba968" />
        <path d="M135 298c-1-41 12-68 37-84 0 39-12 67-37 84Z" fill="#56c477" />
        <path d="M135 301c-14-35-38-47-62-49 14 32 35 48 62 49Z" fill="#2f995e" />
        <path d="M136 301c12-33 33-49 57-54-11 34-31 50-57 54Z" fill="#39ae6b" />
        <path d="M135 294v49" stroke="#358b58" strokeWidth="4" />
        <path d="M111 342h49l-6 28h-37z" fill="#e6edf7" />
        <ellipse cx="135.5" cy="342" rx="24.5" ry="5" fill="#f8fbff" />
        <path d="M117 352h37" stroke="#d4dfef" strokeWidth="2" />
      </g>

      <g filter="url(#tile-shadow)">
        <g transform="rotate(-3 268 57)">
          <rect x="223" y="13" width="89" height="75" rx="16" fill="url(#blue-tile)" />
          <path d="m251 43-10 9 10 9m25-18 10 9-10 9m-7-25-10 32" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g transform="rotate(-10 199 126)">
          <rect x="157" y="91" width="78" height="77" rx="17" fill="#8b55f5" />
          <path d="m196 107 4 5 7-1 2 7 6 3-3 7 2 6-7 3-3 6-7-3-6 2-3-7-6-4 3-7-1-6 7-2 4-6Z" fill="white" />
          <circle cx="198" cy="128" r="6" fill="#8b55f5" />
        </g>
        <g transform="rotate(5 514 65)">
          <rect x="470" y="17" width="82" height="79" rx="18" fill="#ff870d" />
          <circle cx="511" cy="56" r="22" fill="none" stroke="white" strokeWidth="4" />
          <path d="M489 56h44M511 34c-14 14-14 30 0 44m0-44c14 14 14 30 0 44M495 42h32m-32 28h32" fill="none" stroke="white" strokeWidth="3" />
        </g>
        <g transform="rotate(7 575 200)">
          <rect x="540" y="165" width="69" height="69" rx="16" fill="#35b979" />
          <path d="m556 215 5-15 22-23c4-4 10 2 6 6l-22 23-11 9Z" fill="white" />
          <path d="m556 215 11-9" stroke="#d9f6e8" strokeWidth="3" />
        </g>
      </g>

      <g className="laptop">
        <path d="M250 106h271c9 0 15 7 14 16l-13 205H223l12-205c1-9 6-16 15-16Z" fill="#17243a" />
        <path d="M250 115h267c4 0 7 3 7 8l-12 185H231l11-185c1-5 4-8 8-8Z" fill="url(#screen)" />
        <rect x="246" y="128" width="257" height="20" rx="10" fill="#dfe5ef" />
        <circle cx="258" cy="138" r="3.5" fill="#ff6d61" />
        <circle cx="269" cy="138" r="3.5" fill="#ffc34c" />
        <circle cx="280" cy="138" r="3.5" fill="#4bc381" />
        <rect x="298" y="134" width="192" height="8" rx="4" fill="#f9fbff" />
        <rect x="247" y="160" width="116" height="72" rx="8" fill="#a9d2ff" />
        <circle cx="326" cy="181" r="9" fill="#fff" opacity=".95" />
        <path d="m254 225 28-35 17 20 17-15 42 37h-104Z" fill="#2874c7" />
        <path d="m283 210 16-15 42 37h-73Z" fill="#16599f" />
        <rect x="378" y="163" width="112" height="11" rx="5.5" fill="#b9c3d3" />
        <rect x="378" y="184" width="112" height="11" rx="5.5" fill="#cbd3df" />
        <rect x="378" y="205" width="96" height="11" rx="5.5" fill="#d2d9e4" />
        <rect x="378" y="226" width="103" height="11" rx="5.5" fill="#d2d9e4" />
        <rect x="244" y="248" width="69" height="34" rx="9" fill="#ffac3e" />
        <rect x="326" y="248" width="69" height="34" rx="9" fill="#5598f4" />
        <rect x="408" y="248" width="69" height="34" rx="9" fill="#49bd82" />
        <path d="m223 327 299 0 26 13c4 2 2 8-4 10-48 12-258 14-350 1l-20-4c-6-1-8-6-3-9l52-11Z" fill="url(#laptop)" />
        <path d="m225 328 295 0 14 10H210z" fill="#c4d4ed" />
        <path d="m328 332-8 9h45l-8-9z" fill="#8297b5" />
        <path d="M213 348c78 11 267 11 337 0" fill="none" stroke="#7186a4" strokeWidth="2" opacity=".7" />
      </g>
    </svg>
  )
}

function Home() {
  const [activeSection, setActiveSection] = useState('home')

  return (
    <div className="landing-page" id="home">
      <header className="site-header">
        <div className="header-space" aria-hidden="true" />
        <nav className="main-nav" aria-label="Main navigation">
          <a
            className={`nav-link${activeSection === 'home' ? ' active' : ''}`}
            href="#home"
            aria-current={activeSection === 'home' ? 'page' : undefined}
            onClick={() => setActiveSection('home')}
          >
            <HomeIcon />
            <span>Home</span>
          </a>
          <a
            className={`nav-link${activeSection === 'about' ? ' active' : ''}`}
            href="#about"
            aria-current={activeSection === 'about' ? 'page' : undefined}
            onClick={() => setActiveSection('about')}
          >
            <InfoIcon />
            <span>About</span>
          </a>
          <a
            className={`nav-link${activeSection === 'contact' ? ' active' : ''}`}
            href="#contact"
            aria-current={activeSection === 'contact' ? 'page' : undefined}
            onClick={() => setActiveSection('contact')}
          >
            <MailIcon />
            <span>Contact Us</span>
          </a>
        </nav>
      </header>

      <main>
        <section className="hero" aria-labelledby="brand-title">
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="brand-lockup">
                <BrandMark />
                <div className="brand-text">
                  <h1 id="brand-title">
                    <span>Orange</span> Apps.in
                  </h1>
                  <p className="tagline"><span />Your Ideas. Our Web Solutions.<span /></p>
                </div>
              </div>
              <p className="intro">
                We are creating websites for different organizations or different types of
                businesses, creating customized, user-friendly websites.
              </p>
            </div>
            <div className="hero-visual">
              <HeroArtwork />
            </div>
          </div>
        </section>
        <About />
        <Contactus />
      </main>

      <footer className="site-footer">
        <p>© 2026 <strong>Orange Apps.in.</strong> All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Home
