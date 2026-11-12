import './Apps.css'

interface AppsProps {
  onOpenImageToPdf: () => void
}

function Apps({ onOpenImageToPdf }: AppsProps) {
  return (
    <section className="page-view apps-page">
      <div className="app-list">
        <a
          className="app-card"
          href="/image-to-pdf"
          onClick={(event) => {
            event.preventDefault()
            onOpenImageToPdf()
          }}
        >
          <span className="app-mark" aria-hidden="true">
            <svg className="pdf-mark-icon" viewBox="0 0 40 44">
              <path d="M8 2h16l10 10v28H8z" />
              <path d="M24 2v11h10" />
              <text x="20" y="30" textAnchor="middle">PDF</text>
            </svg>
          </span>
          <span className="app-name">Image to PDF</span>
        </a>
      </div>
    </section>
  )
}

export default Apps
