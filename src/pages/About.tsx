function About() {
  return (
    <section className="info-section about-section" id="about" aria-labelledby="about-title">
      <div className="info-section-inner">
        <p className="section-eyebrow">ABOUT ORANGE APPS</p>
        <h2 id="about-title">Websites built around your ideas</h2>
        <p className="section-intro">
          We help organizations and growing businesses turn their ideas into clear,
          easy-to-use websites. From the first sketch to launch, our focus is on
          thoughtful design and solutions that work for your audience.
        </p>
        <div className="service-list">
          <article className="service-card">
            <span className="service-number">01</span>
            <h3>Custom websites</h3>
            <p>Purpose-built websites shaped around your organization and goals.</p>
          </article>
          <article className="service-card">
            <span className="service-number">02</span>
            <h3>Responsive design</h3>
            <p>Comfortable, consistent experiences on phones, tablets, and desktops.</p>
          </article>
          <article className="service-card">
            <span className="service-number">03</span>
            <h3>Friendly support</h3>
            <p>Helpful guidance to keep your website clear, current, and useful.</p>
          </article>
        </div>
      </div>
    </section>
  )
}

export default About