import './Games.css'

interface GamesProps {
  onOpenEndlessRunner: () => void
}

function Games({ onOpenEndlessRunner }: GamesProps) {
  return (
    <section className="page-view games-page">
      <div className="games-list">
        <a
          className="game-card"
          href="/endless-runner"
          onClick={(event) => {
            event.preventDefault()
            onOpenEndlessRunner()
          }}
        >
          <span className="game-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M7.5 7h9a4 4 0 0 1 3.9 3.1l1 4.5a2.5 2.5 0 0 1-4.1 2.4l-2.1-1.8H8.8l-2.1 1.8a2.5 2.5 0 0 1-4.1-2.4l1-4.5A4 4 0 0 1 7.5 7Z" />
              <path d="M8 10v4m-2-2h4m6-1h.01M18 13h.01" />
            </svg>
          </span>
          <span className="game-name">Endless Runner</span>
        </a>
      </div>
    </section>
  )
}

export default Games
