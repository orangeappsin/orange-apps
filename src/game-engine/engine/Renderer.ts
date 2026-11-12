import type {
  GameConfig,
  GameState,
  LoadedAssets,
  ObstacleDefinition,
  CollectibleDefinition,
  ThemeConfig,
} from '../types'
import type { PlayerController } from './PlayerController'
import type { Obstacle } from './ObstacleManager'
import type { Collectible } from './CollectibleManager'
import { BackgroundManager } from './BackgroundManager'

export class Renderer {
  private readonly canvas: HTMLCanvasElement
  private readonly config: GameConfig
  private readonly theme: ThemeConfig
  private readonly assets: LoadedAssets
  private readonly context: CanvasRenderingContext2D
  private readonly groundY: number
  private readonly background: BackgroundManager
  private readonly resizeObserver: ResizeObserver | null
  private readonly obstacleImages = new Map<ObstacleDefinition, HTMLImageElement>()
  private readonly collectibleImages = new Map<CollectibleDefinition, HTMLImageElement>()
  private pixelRatio = 1
  private displayWidth = 0
  private displayHeight = 0
  private worldScale = 1
  private worldOffsetX = 0
  private worldOffsetY = 0
  private resizeFrameId: number | null = null
  private lastPlayer: PlayerController | null = null
  private lastObstacles: readonly Obstacle[] = []
  private lastCollectibles: readonly Collectible[] = []
  private lastElapsedSeconds = 0
  private lastSpeed = 0
  private lastState: GameState = 'loading'
  private displayedSpeed = -1
  private speedLabel = ''

  constructor(
    canvas: HTMLCanvasElement,
    config: GameConfig,
    theme: ThemeConfig,
    assets: LoadedAssets,
  ) {
    this.canvas = canvas
    this.config = config
    this.theme = theme
    this.assets = assets
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas 2D is not available in this browser.')
    this.context = context
    this.groundY = config.canvas.height - config.environment.groundHeight
    this.background = new BackgroundManager(theme)
    for (const definition of theme.obstacles) {
      const image = assets.images.get(`obstacle.${definition.key}`)
      if (image) this.obstacleImages.set(definition, image)
    }
    for (const definition of theme.collectibles) {
      const image = assets.images.get(`collectible.${definition.key}`)
      if (image) this.collectibleImages.set(definition, image)
    }
    this.resizeCanvas()
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(this.resize)
      this.resizeObserver.observe(canvas.parentElement ?? canvas)
    } else {
      this.resizeObserver = null
      window.addEventListener('resize', this.resize)
    }
  }

  resetBackground(): void {
    this.background.reset()
  }

  updateBackground(deltaSeconds: number, speed: number): void {
    this.background.update(deltaSeconds, speed)
  }

  draw(
    player: PlayerController,
    obstacles: readonly Obstacle[],
    collectibles: readonly Collectible[],
    elapsedSeconds: number,
    speed: number,
    state: GameState,
  ): void {
    this.lastPlayer = player
    this.lastObstacles = obstacles
    this.lastCollectibles = collectibles
    this.lastElapsedSeconds = elapsedSeconds
    this.lastSpeed = speed
    this.lastState = state
    this.context.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0)
    this.context.clearRect(0, 0, this.displayWidth, this.displayHeight)
    this.context.fillStyle = this.theme.colors.sky
    this.context.fillRect(0, 0, this.displayWidth, this.displayHeight)
    this.context.save()
    this.context.translate(this.worldOffsetX, this.worldOffsetY)
    this.context.scale(this.worldScale, this.worldScale)
    this.background.draw(
      this.context,
      this.config.canvas.width,
      this.config.canvas.height,
      this.groundY,
      this.assets,
    )
    this.context.restore()
    this.drawFrame(player, obstacles, collectibles, elapsedSeconds, speed, state)
  }

  private drawFrame(
    player: PlayerController,
    obstacles: readonly Obstacle[],
    collectibles: readonly Collectible[],
    elapsedSeconds: number,
    speed: number,
    state: GameState,
  ): void {
    const context = this.context
    for (const obstacle of obstacles) this.drawObstacle(obstacle)
    for (const collectible of collectibles) this.drawCollectible(collectible, elapsedSeconds)
    this.drawPlayer(player, elapsedSeconds)

    if (state !== 'playing') {
      context.fillStyle = this.theme.colors.overlay
      context.fillRect(0, 0, this.displayWidth, this.displayHeight)
      context.fillStyle = '#fff'
      context.textAlign = 'center'
      context.font = `700 ${Math.max(16, Math.min(30, this.displayHeight * 0.045))}px system-ui, sans-serif`
      context.fillText(
        state === 'loading' ? 'Loading game...' : state === 'menu' ? this.theme.title : state === 'paused' ? 'Paused' : 'Game over',
        this.displayWidth / 2,
        this.displayHeight / 2,
      )
    }

    if (state === 'playing') {
      const displayedSpeed = Math.round(speed)
      if (displayedSpeed !== this.displayedSpeed) {
        this.displayedSpeed = displayedSpeed
        this.speedLabel = `Speed ${displayedSpeed}`
      }
      context.fillStyle = this.theme.colors.text
      context.font = `600 ${Math.max(11, Math.min(18, this.displayHeight * 0.025))}px system-ui, sans-serif`
      context.textAlign = 'right'
      context.fillText(this.speedLabel, this.displayWidth - 16, 24)
    }
  }

  dispose(): void {
    this.resizeObserver?.disconnect()
    if (this.resizeFrameId !== null) {
      window.cancelAnimationFrame(this.resizeFrameId)
      this.resizeFrameId = null
    }
    if (!this.resizeObserver) window.removeEventListener('resize', this.resize)
  }

  private readonly resize = (): void => {
    if (this.resizeFrameId !== null) return
    this.resizeFrameId = window.requestAnimationFrame(() => {
      this.resizeFrameId = null
      this.resizeCanvas()
    })
  }

  private readonly resizeCanvas = (): void => {
    const { width, height } = this.config.canvas
    const displayWidth = this.canvas.clientWidth
    const displayHeight = this.canvas.clientHeight
    if (displayWidth <= 0 || displayHeight <= 0) return

    const pixelRatio = Math.min(window.devicePixelRatio || 1, this.config.canvas.maxDevicePixelRatio)
    const backingWidth = Math.round(displayWidth * pixelRatio)
    const backingHeight = Math.round(displayHeight * pixelRatio)
    if (
      displayWidth === this.displayWidth
      && displayHeight === this.displayHeight
      && pixelRatio === this.pixelRatio
      && this.canvas.width === backingWidth
      && this.canvas.height === backingHeight
    ) return

    this.pixelRatio = pixelRatio
    this.displayWidth = displayWidth
    this.displayHeight = displayHeight
    if (this.canvas.width !== backingWidth || this.canvas.height !== backingHeight) {
      this.canvas.width = backingWidth
      this.canvas.height = backingHeight
    }
    this.worldScale = Math.min(displayWidth / width, displayHeight / height)
    this.worldOffsetX = (displayWidth - width * this.worldScale) / 2
    this.worldOffsetY = (displayHeight - height * this.worldScale) / 2
    this.context.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0)
    this.context.imageSmoothingEnabled = true
    if (this.lastPlayer) {
      this.draw(
        this.lastPlayer,
        this.lastObstacles,
        this.lastCollectibles,
        this.lastElapsedSeconds,
        this.lastSpeed,
        this.lastState,
      )
    }
  }

  private drawPlayer(player: PlayerController, elapsedSeconds: number): void {
    const animationKey = player.isSliding ? 'player.slide' : player.airborne ? 'player.jump' : 'player.run'
    const image = this.assets.images.get(animationKey)
    const sprite = this.assets.sprites.get(animationKey)
    const bounds = player.drawBounds
    if (image && sprite) {
      const frame = Math.floor(elapsedSeconds * sprite.framesPerSecond) % sprite.frameCount
      this.context.drawImage(
        image,
        frame * sprite.frameWidth,
        0,
        sprite.frameWidth,
        sprite.frameHeight,
        this.worldOffsetX + bounds.x * this.worldScale,
        this.worldOffsetY + bounds.y * this.worldScale,
        bounds.width * this.worldScale,
        bounds.height * this.worldScale,
      )
      return
    }

    const { context } = this
    context.save()
    context.translate(
      this.worldOffsetX + bounds.x * this.worldScale,
      this.worldOffsetY + bounds.y * this.worldScale,
    )
    context.scale(this.worldScale, this.worldScale)
    const bodyHeight = bounds.height * (player.isSliding ? 0.7 : 0.76)
    const bodyY = bounds.height - bodyHeight
    context.fillStyle = this.theme.colors.player
    roundedRect(context, 3, bodyY, bounds.width - 6, bodyHeight, 13)
    context.fill()

    context.fillStyle = this.theme.colors.playerDetail
    context.beginPath()
    context.arc(bounds.width * 0.69, bodyY + bodyHeight * 0.28, 3.2, 0, Math.PI * 2)
    context.fill()

    if (!player.isSliding) {
      const stride = player.airborne ? 0 : Math.sin(elapsedSeconds * 16) * 5
      context.strokeStyle = this.theme.colors.playerDetail
      context.lineWidth = 5
      context.lineCap = 'round'
      context.beginPath()
      context.moveTo(16, bounds.height - 5)
      context.lineTo(13 + stride, bounds.height)
      context.moveTo(bounds.width - 17, bounds.height - 5)
      context.lineTo(bounds.width - 12 - stride, bounds.height)
      context.stroke()
    }
    context.restore()
  }

  private drawObstacle(obstacle: Obstacle): void {
    const definition = obstacle.definition
    if (!definition) return
    const x = obstacle.x
    const y = this.groundY - obstacle.height - definition.offsetFromGround
    const image = this.obstacleImages.get(definition)
    if (image) {
      this.context.drawImage(
        image,
        this.worldOffsetX + x * this.worldScale,
        this.worldOffsetY + y * this.worldScale,
        obstacle.width * this.worldScale,
        obstacle.height * this.worldScale,
      )
      return
    }

    this.context.save()
    this.context.translate(
      this.worldOffsetX + x * this.worldScale,
      this.worldOffsetY + y * this.worldScale,
    )
    this.context.scale(this.worldScale, this.worldScale)
    this.context.fillStyle = definition.color || this.theme.colors.obstacle
    roundedRect(this.context, 0, 0, obstacle.width, obstacle.height, 8)
    this.context.fill()
    this.context.restore()
  }

  private drawCollectible(item: Collectible, elapsedSeconds: number): void {
    const definition = item.definition
    if (!definition) return
    const size = definition.size
    const image = this.collectibleImages.get(definition)
    const y = item.y + Math.sin(elapsedSeconds * 5 + item.phase) * 5
    if (image) {
      this.context.drawImage(
        image,
        this.worldOffsetX + item.x * this.worldScale,
        this.worldOffsetY + y * this.worldScale,
        size * this.worldScale,
        size * this.worldScale,
      )
      return
    }

    const context = this.context
    context.save()
    context.translate(
      this.worldOffsetX + item.x * this.worldScale,
      this.worldOffsetY + y * this.worldScale,
    )
    context.scale(this.worldScale, this.worldScale)
    context.fillStyle = definition.color || this.theme.colors.collectible
    context.beginPath()
    context.arc(size / 2, size / 2, size * 0.46, 0, Math.PI * 2)
    context.fill()
    context.strokeStyle = 'rgba(255, 255, 255, 0.78)'
    context.lineWidth = 3
    context.beginPath()
    context.arc(size / 2, size / 2, size * 0.28, 0, Math.PI * 2)
    context.stroke()
    context.restore()
  }
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  const corner = Math.min(radius, width / 2, height / 2)
  context.beginPath()
  context.roundRect(x, y, width, height, corner)
}
