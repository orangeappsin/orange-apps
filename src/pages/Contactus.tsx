const sampleAddress = '123 Orange Avenue, Suite 200, San Francisco, CA 94105'
const samplePhone = '+1 (415) 555-0148'
const sampleEmail = 'hello@orangeapps.example'
const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sampleAddress)}`

function Contactus() {
  return (
    <section className="info-section contact-section" id="contact" aria-labelledby="contact-title">
      <div className="info-section-inner contact-inner">
        <div className="contact-heading">
          <p className="section-eyebrow">LET'S TALK</p>
          <h2 id="contact-title">Have a project in mind?</h2>
          <p className="section-intro">
            Tell us what you are building. We would be happy to hear from you.
          </p>
          <a className="contact-cta" href={`mailto:${sampleEmail}?subject=Website%20project%20inquiry`}>
            Email us about your project <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="contact-card">
          <p className="sample-note">Sample contact details</p>
          <a className="contact-detail" href={`tel:${samplePhone.replace(/[^\d+]/g, '')}`}>
            <span className="contact-icon" aria-hidden="true">☎</span>
            <span><small>Call us</small><strong>{samplePhone}</strong></span>
          </a>
          <a className="contact-detail" href={`mailto:${sampleEmail}`}>
            <span className="contact-icon" aria-hidden="true">✉</span>
            <span><small>Email</small><strong>{sampleEmail}</strong></span>
          </a>
          <a className="contact-detail" href={mapUrl} target="_blank" rel="noreferrer">
            <span className="contact-icon" aria-hidden="true">⌖</span>
            <span><small>Address &amp; location</small><strong>{sampleAddress}</strong></span>
            <span className="external-arrow" aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default Contactus