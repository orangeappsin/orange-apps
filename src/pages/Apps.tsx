import './Apps.css'

interface AppsProps {
  onOpenImageToPdf: () => void
}

const apps = [
  { name: 'Image to PDF', type: 'PDF tools', description: 'Convert your images into a PDF in seconds.', color: 'peach', mark: 'PDF' },
  { name: 'Orderly', type: 'Business tools', description: 'A simpler way to manage everyday orders.', color: 'violet', mark: '◈' },
  { name: 'Fieldnotes', type: 'Custom websites', description: 'A flexible home for stories and projects.', color: 'green', mark: '✎' },
]

function Apps({ onOpenImageToPdf }: AppsProps) {
  return (
    <section className="page-view apps-page">
      <div className="apps-heading">
        <h1>Apps &amp; Services</h1>
        <p>Practical digital tools for everyday tasks.</p>
      </div>
      <div className="app-list">
        {apps.map((app) => {
          const content = (
            <>
            <div className={`app-mark ${app.color}`} aria-hidden="true">
              {app.name === 'Image to PDF' ? (
                <svg className="pdf-mark-icon" viewBox="0 0 40 44">
                  <path d="M8 2h16l10 10v28H8z" />
                  <path d="M24 2v11h10" />
                  <text x="20" y="30" textAnchor="middle">PDF</text>
                </svg>
              ) : app.mark}
            </div>
            <div className="app-copy">
              <p>{app.type}</p>
              <h2>{app.name}</h2>
              <span>{app.description}</span>
            </div>
            <span className="app-arrow" aria-hidden="true">↗</span>
            </>
          )

          return app.name === 'Image to PDF' ? (
            <a className="app-card" href="/image-to-pdf" key={app.name} onClick={(event) => {
              event.preventDefault()
              onOpenImageToPdf()
            }}>
              {content}
            </a>
          ) : (
            <article className="app-card" key={app.name}>{content}</article>
          )
        })}
      </div>
    </section>
  )
}

export default Apps
