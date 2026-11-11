import './About.css'

function About() {
  return (
    <section className="page-view about-page">
      <div className="about-card">
        <aside className="about-contact">
          <p className="about-kicker">We’re here to help</p>
          <h2>Contact Us</h2>
          <p>Have a question or suggestion? We’d be happy to hear from you.</p>
          <div className="about-contact-links">
            <a href="tel:+918885233325">
              <span aria-hidden="true">☎</span>
              +91 8885233325
            </a>
            <a href="mailto:orangeappsin1@gmail.com">
              <span aria-hidden="true">✉</span>
              orangeappsin1@gmail.com
            </a>
          </div>
        </aside>
        <div className="about-copy">
          <p className="about-kicker">About Orange Apps</p>
          <h1>Useful tools, made easy for everyone.</h1>
          <p className="about-description">
            We believe everyday digital services should be simple and accessible to everyone.
            Orange Apps provides free, easy-to-use tools for people who want to get things done
            without needing technical expertise. We focus on clear experiences, helpful features,
            and dependable service, so you can spend less time figuring things out and more time
            on what matters.
          </p>
          <div className="about-values">
            <span>Free to use</span>
            <span>Easy to access</span>
            <span>Designed for everyone</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
