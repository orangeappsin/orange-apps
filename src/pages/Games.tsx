import './Games.css'


const games = [
  { name: 'Endless Runner', status: 'Coming Soon', description: 'A quick-fire reflex challenge with colorful obstacle rounds.', launch: 'Launching soon' },
  { name: 'Puzzle Quest', status: 'Coming Soon', description: 'Brainy levels, streak bonuses, and clever daily puzzles.', launch: 'Launching soon' },
  { name: 'Orbit Drift', status: 'Coming Soon', description: 'A polished space runner built for short, high-score sessions.', launch: 'Launching soon' },
]


function Games() {
  return (
    <section className="page-view games-page">
      <div className="games-hero">
        <p className="games-kicker">Game Zone</p>
        <h1>Fresh entertainment is on the way.</h1>
        <p className="games-description">
          We are building a small collection of playful, mobile-friendly experiences for quick fun and friendly competition.
        </p>
      </div>


      <div className="games-grid">
        {games.map((game) => (
          <article className="game-card" key={game.name}>
            <span className="game-badge">{game.status}</span>
            <h2>{game.name}</h2>
            <p>{game.description}</p>
            <small>{game.launch}</small>
          </article>
        ))}
      </div>
    </section>
  )
}


export default Games