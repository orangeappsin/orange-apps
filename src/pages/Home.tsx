import './Home.css'
import logoPoster from '../assets/logo_poster.png'

function Home({ onApps }: { onApps: () => void }) {
  return (
    <section className="page-view home-page">
      <div className="home-copy">
        <p className="home-kicker">Free tools for everyday tasks</p>
        <p className="home-tagline">Minimum Efforts, Maximum Impacts</p>
        <p className="home-description">
          Access a growing collection of online tools, completely free. Enjoy a smooth, user-friendly experience with quick results and hassle-free workflows. Your privacy is our priority, we never store your uploaded files.
        </p>
        <button className="home-action" onClick={onApps}>
          Explore our apps <span aria-hidden="true">→</span>
        </button>
      </div>
      <h1 className="home-brand">
          <img className="home-logo" src={logoPoster} alt="Orange Apps" />
        </h1>
    </section>
  )
}

export default Home
