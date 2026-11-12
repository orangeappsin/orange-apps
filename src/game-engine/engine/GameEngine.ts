import { assetConfig } from '../config/assetConfig'
import { gameConfig } from '../config/gameConfig'
import { themeConfig } from '../config/themeConfig'
import type {
  AssetConfig,
  EngineCallbacks,
  GameConfig,
  GameState,
  ThemeConfig,
} from '../types'
import { AudioManager } from '../utils/AudioManager'
import { AssetLoader } from '../utils/AssetLoader'
import { CollectibleManager } from './CollectibleManager'
import { GameLoop } from './GameLoop'
import { ObstacleManager } from './ObstacleManager'
import { PlayerController } from './PlayerController'
import { Renderer } from './Renderer'
import { ScoreManager } from './ScoreManager'

export class GameEngine {
  private readonly canvas: HTMLCanvasElement
  private readonly callbacks: EngineCallbacks
  private readonly config: GameConfig
  private readonly theme: ThemeConfig
  private readonly assets: AssetConfig
  private readonly groundY: number
  private readonly player: PlayerController
  private readonly obstacles: ObstacleManager
  private readonly collectibles: CollectibleManager
  private readonly score: ScoreManager
  private readonly audio = new AudioManager()
  private readonly loader = new AssetLoader()
  private renderer: Renderer | null = null
  private loop: GameLoop | null = null
  private state: GameState = 'loading'
  private speed: number
  private elapsedSeconds = 0
  private lastHudTimestamp = 0
  private lastHudScore = -1
  private lastHudBestScore = -1
  private pointerStart: { x: number; y: number } | null = null
  private disposed = false
  private readonly handleCollect = (value: number): void => {
    this.score.addPoints(value)
    this.audio.play('collect')
  }

  constructor(
    canvas: HTMLCanvasElement,
    callbacks: EngineCallbacks,
    config: GameConfig = gameConfig,
    theme: ThemeConfig = themeConfig,
    assets: AssetConfig = assetConfig,
  ) {
    this.canvas = canvas
    this.callbacks = callbacks
    this.config = config
    this.theme = theme
    this.assets = assets
    this.groundY = config.canvas.height - config.environment.groundHeight
    this.player = new PlayerController({ ...config.player, ...config.physics }, this.groundY)
    this.obstacles = new ObstacleManager(theme.obstacles, config.spawning, config.canvas.width, this.groundY)
    this.collectibles = new CollectibleManager(theme.collectibles, config.spawning, config.canvas.width, this.groundY)
    this.score = new ScoreManager(config.scoring)
    this.speed = config.movement.startSpeed

    this.canvas.addEventListener('pointerdown', this.handlePointerDown)
    this.canvas.addEventListener('pointerup', this.handlePointerUp)
    this.canvas.addEventListener('pointercancel', this.handlePointerCancel)
    window.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
  }

  async initialize(): Promise<void> {
    const loadedAssets = await this.loader.load(this.assets, this.callbacks.onError)
    if (this.disposed) return

    this.audio.load(this.assets.audio, this.callbacks.onError)
    try {
      this.renderer = new Renderer(this.canvas, this.config, this.theme, loadedAssets)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'The game canvas could not be initialized.'
      this.callbacks.onError(message)
      return
    }

    this.loop = new GameLoop(this.config.canvas, (deltaSeconds, timestamp) => {
      this.update(deltaSeconds, timestamp)
    })
    this.setState('menu')
    this.emitHud(true)
    this.render()
  }

  start(): void {
    if (this.disposed || !this.renderer) return
    this.score.reset()
    this.player.reset()
    this.obstacles.reset()
    this.collectibles.reset()
    this.renderer.resetBackground()
    this.speed = this.config.movement.startSpeed
    this.elapsedSeconds = 0
    this.lastHudTimestamp = 0
    this.setState('playing')
    this.audio.play('start')
    this.audio.playLoop('run')
    this.audio.startMusic()
    this.emitHud(true)
    this.loop?.start()
  }

  pause(): void {
    if (this.state !== 'playing') return
    this.loop?.stop()
    this.audio.stopLoop('run')
    this.audio.pauseMusic()
    this.setState('paused')
    this.render()
  }

  resume(): void {
    if (this.state !== 'paused') return
    this.setState('playing')
    this.audio.playLoop('run')
    this.audio.startMusic()
    this.loop?.start()
  }

  showMenu(): void {
    this.loop?.stop()
    this.audio.stopLoop('run')
    this.audio.pauseMusic()
    this.player.reset()
    this.obstacles.reset()
    this.collectibles.reset()
    this.setState('menu')
    this.render()
  }

  toggleSound(): void {
    this.setMuted(!this.audio.isMuted())
  }

  setMuted(muted: boolean): void {
    this.audio.setMuted(muted)
    this.callbacks.onSoundChange(muted)
  }

  jump(): void {
    if (this.state === 'playing' && this.player.jump()) this.audio.play('jump')
  }

  slide(): void {
    if (this.state === 'playing' && this.player.slide()) this.audio.play('slide')
  }

  dispose(): void {
    this.disposed = true
    this.loop?.stop()
    this.renderer?.dispose()
    this.audio.dispose()
    this.canvas.removeEventListener('pointerdown', this.handlePointerDown)
    this.canvas.removeEventListener('pointerup', this.handlePointerUp)
    this.canvas.removeEventListener('pointercancel', this.handlePointerCancel)
    window.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
  }

  private update(deltaSeconds: number, timestamp: number): void {
    if (this.state !== 'playing') return
    this.elapsedSeconds += deltaSeconds
    const distance = this.speed * deltaSeconds
    this.score.trackDistance(distance)
    this.speed = Math.min(
      this.config.movement.maxSpeed,
      Math.max(
        this.config.movement.minSpeed,
        this.config.movement.startSpeed
          + Math.floor(this.score.distanceTraveled / this.config.difficulty.speedIncreaseEveryDistance)
          * this.config.movement.acceleration,
      ),
    )
    this.player.update(deltaSeconds)
    this.obstacles.update(deltaSeconds, this.speed)
    this.collectibles.update(deltaSeconds, this.speed, this.player.bounds, this.handleCollect)
    this.renderer?.updateBackground(deltaSeconds, this.speed)

    if (this.obstacles.collidesWith(this.player.bounds)) {
      this.audio.play('collision')
      this.audio.play('gameOver')
      this.audio.stopLoop('run')
      this.audio.pauseMusic()
      this.loop?.stop()
      this.setState('gameover')
      this.emitHud(true)
      this.render()
      return
    }

    this.emitHud(false, timestamp)
    this.render()
  }

  private render(): void {
    this.renderer?.draw(
      this.player,
      this.obstacles.items,
      this.collectibles.items,
      this.elapsedSeconds,
      this.speed,
      this.state,
    )
  }

  private setState(state: GameState): void {
    this.state = state
    this.callbacks.onStateChange(state)
  }

  private emitHud(force: boolean, timestamp = performance.now()): void {
    if (!force && timestamp - this.lastHudTimestamp < 100) return
    const score = this.score.currentScore
    const bestScore = this.score.currentBestScore
    if (!force && score === this.lastHudScore && bestScore === this.lastHudBestScore) return
    this.lastHudScore = score
    this.lastHudBestScore = bestScore
    this.lastHudTimestamp = timestamp
    this.callbacks.onHudChange({ score, bestScore })
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (event.repeat) return
    if (event.code === 'Escape') {
      if (this.state === 'playing') this.pause()
      else if (this.state === 'paused') this.resume()
      return
    }

    if (this.state !== 'playing') return
    if (event.code === 'Space' || event.code === 'ArrowUp') {
      event.preventDefault()
      this.jump()
    } else if (event.code === 'ArrowDown') {
      event.preventDefault()
      this.slide()
    }
  }

  private readonly handlePointerDown = (event: PointerEvent): void => {
    this.pointerStart = { x: event.clientX, y: event.clientY }
  }

  private readonly handlePointerUp = (event: PointerEvent): void => {
    if (!this.pointerStart || this.state !== 'playing') {
      this.pointerStart = null
      return
    }
    const deltaY = event.clientY - this.pointerStart.y
    if (deltaY >= this.config.controls.swipeThreshold) this.slide()
    else this.jump()
    this.pointerStart = null
  }

  private readonly handlePointerCancel = (): void => {
    this.pointerStart = null
  }

  private readonly handleVisibilityChange = (): void => {
    if (this.config.controls.pauseWhenHidden && document.hidden) this.pause()
  }
}
