import { useEffect, useRef, useState } from 'react'
import { GameEngine } from '../game-engine/engine/GameEngine'
import { themeConfig } from '../game-engine/config/themeConfig'
import type { GameState, HudData } from '../game-engine/types'
import './EndlessRunner.css'

const initialHud: HudData = { score: 0, bestScore: 0 }

interface EndlessRunnerProps {
  onExit: () => void
}

function EndlessRunner({ onExit }: EndlessRunnerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const runnerWindowRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<GameEngine | null>(null)
  const [gameState, setGameState] = useState<GameState>('loading')
  const [hud, setHud] = useState(initialHud)
  const [muted, setMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isRotatedFullscreen, setIsRotatedFullscreen] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const engine = new GameEngine(canvas, {
      onStateChange: setGameState,
      onHudChange: setHud,
      onSoundChange: setMuted,
      onError: setError,
    })
    engineRef.current = engine
    void engine.initialize()

    return () => {
      engine.dispose()
      engineRef.current = null
    }
  }, [])

  useEffect(() => {
    const updateFullscreen = () => {
      const isRunnerFullscreen = document.fullscreenElement === runnerWindowRef.current
      setIsFullscreen(isRunnerFullscreen)
      if (!isRunnerFullscreen) setIsRotatedFullscreen(false)
    }
    document.addEventListener('fullscreenchange', updateFullscreen)
    return () => document.removeEventListener('fullscreenchange', updateFullscreen)
  }, [])

  const handleRotate = async () => {
    const runnerWindow = runnerWindowRef.current
    if (!runnerWindow) return

    try {
      if (document.fullscreenElement === runnerWindow) {
        if (typeof window.screen.orientation.unlock === 'function') {
          window.screen.orientation.unlock()
        }
        await document.exitFullscreen()
        return
      }

      await runnerWindow.requestFullscreen()
      if (window.matchMedia('(orientation: portrait)').matches) {
        try {
          if (typeof window.screen.orientation.lock === 'function') {
            await window.screen.orientation.lock('landscape')
          } else {
            setIsRotatedFullscreen(true)
          }
        } catch {
          setIsRotatedFullscreen(true)
        }
      }
      setError('')
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'The screen could not be rotated.'
      setError(`Could not switch to landscape mode: ${message}`)
    }
  }

  const engine = engineRef.current
  const isGameActive = gameState === 'playing' || gameState === 'paused' || gameState === 'gameover'

  return (
    <section className="page-view endless-runner-page">
      <div className="runner-shell">
        <div
          className={`runner-window${isRotatedFullscreen ? ' runner-window--rotated' : ''}`}
          ref={runnerWindowRef}
        >
          <div className="runner-window-bar">
            <button type="button" className="runner-icon-button runner-exit-button" onClick={onExit}>
              Games
            </button>
            <span className="runner-window-label"><span aria-hidden="true">●</span> {themeConfig.title}</span>
            <div className="runner-toolbar">
              <span className="runner-best">Best: {hud.bestScore}</span>
              <button
                type="button"
                className="runner-icon-button runner-rotate-button"
                onClick={handleRotate}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Rotate to landscape and enter fullscreen'}
                title={isFullscreen ? 'Exit fullscreen' : 'Rotate to landscape and enter fullscreen'}
              >
                {isFullscreen ? 'Exit' : 'Rotate'}
              </button>
              <button
                type="button"
                className="runner-icon-button"
                onClick={() => engine?.toggleSound()}
                aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
                title={muted ? 'Turn sound on' : 'Turn sound off'}
              >
                {muted ? 'Sound off' : 'Sound on'}
              </button>
              {gameState === 'playing' && (
                <button type="button" className="runner-icon-button" onClick={() => engine?.pause()}>
                  Pause
                </button>
              )}
              {gameState === 'paused' && (
                <button type="button" className="runner-icon-button" onClick={() => engine?.resume()}>
                  Resume
                </button>
              )}
            </div>
          </div>

          <div className="runner-stage">
            <canvas
              ref={canvasRef}
              className="runner-canvas"
              width={960}
              height={540}
              aria-label={`${themeConfig.title} game. Jump over ground obstacles and slide under overhead obstacles.`}
            />

            {isGameActive && (
              <div className="runner-hud">
                <span>Score <strong>{hud.score}</strong></span>
                <span>Best <strong>{hud.bestScore}</strong></span>
              </div>
            )}

            {gameState === 'loading' && (
              <div className="runner-overlay">
                <div className="runner-dialog">
                  <p className="runner-kicker">Preparing your game</p>
                  <h2>Loading…</h2>
                </div>
              </div>
            )}

            {gameState === 'menu' && (
              <div className="runner-overlay">
                <div className="runner-dialog">
                  <p className="runner-kicker">{themeConfig.themeName}</p>
                  <h2>{themeConfig.title}</h2>
                  <p>Jump with Space or ↑. Slide with ↓. Tap to jump or swipe down to slide.</p>
                  <p className="runner-best-score">Best score <strong>{hud.bestScore}</strong></p>
                  <button type="button" className="runner-primary-button" onClick={() => engine?.start()}>
                    Play
                  </button>
                </div>
              </div>
            )}

            {gameState === 'paused' && (
              <div className="runner-overlay">
                <div className="runner-dialog">
                  <p className="runner-kicker">Take a breather</p>
                  <h2>Paused</h2>
                  <div className="runner-dialog-actions">
                    <button type="button" className="runner-primary-button" onClick={() => engine?.resume()}>
                      Resume
                    </button>
                    <button type="button" className="runner-secondary-button" onClick={() => engine?.start()}>
                      Restart
                    </button>
                    <button type="button" className="runner-secondary-button" onClick={() => engine?.showMenu()}>
                      Main menu
                    </button>
                  </div>
                </div>
              </div>
            )}

            {gameState === 'gameover' && (
              <div className="runner-overlay">
                <div className="runner-dialog">
                  <p className="runner-kicker">Nice run</p>
                  <h2>Game over</h2>
                  <p className="runner-final-score">Score <strong>{hud.score}</strong></p>
                  <p className="runner-best-score">Best score <strong>{hud.bestScore}</strong></p>
                  <div className="runner-dialog-actions">
                    <button type="button" className="runner-primary-button" onClick={() => engine?.start()}>
                      Play again
                    </button>
                    <button type="button" className="runner-secondary-button" onClick={() => engine?.showMenu()}>
                      Main menu
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="runner-controls">
            <p>
              {gameState === 'playing'
                ? 'Space / ↑ Jump · ↓ Slide · Esc Pause'
                : 'Jump over ground obstacles and slide under overhead barriers.'}
            </p>
            {gameState === 'playing' && (
              <div className="runner-touch-controls">
                <button type="button" className="runner-secondary-button" onClick={() => engine?.slide()}>
                  Slide
                </button>
                <button type="button" className="runner-primary-button" onClick={() => engine?.jump()}>
                  Jump
                </button>
              </div>
            )}
            {gameState === 'paused' && <span className="runner-controls-note">Press Esc to resume.</span>}
          </div>
        </div>
        {error && <p className="runner-error" role="status">{error}</p>}
      </div>
    </section>
  )
}

export default EndlessRunner
