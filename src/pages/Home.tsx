import './Home.css'
import logoPoster from '../assets/logo_poster.png'

function Home({ onApps }: { onApps: () => void }) {
  return (
    <section className="page-view home-page">
      <div className="home-copy">
        <p className="home-kicker">Simple tools for everyday tasks</p>
        <h1 className="home-tagline">Get more done, with less effort.</h1>
        <p className="home-description">
          Discover free, easy-to-use tools for the things you do every day. Your files stay yours — we never store your uploads.
        </p>
        <button className="home-action" onClick={onApps}>
          Explore our apps <span aria-hidden="true">→</span>
        </button>
      </div>
      <div className="home-brand">
        <img className="home-logo" src={logoPoster} alt="Orange Apps" />
      </div>
    </section>
  )
}

export default Home
