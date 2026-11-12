export type GameState = 'loading' | 'menu' | 'playing' | 'paused' | 'gameover'

export interface Rectangle {
  x: number
  y: number
  width: number
  height: number
}

export interface HitboxConfig {
  x: number
  y: number
  width: number
  height: number
}

export interface SpriteAsset {
  src: string
  frameWidth: number
  frameHeight: number
  frameCount: number
  framesPerSecond: number
}

export interface AssetConfig {
  player: {
    run?: SpriteAsset
    jump?: SpriteAsset
    slide?: SpriteAsset
  }
  obstacles: Record<string, string>
  collectibles: Record<string, string>
  environment: {
    background?: string
    ground?: string
  }
  audio: {
    start?: string
    run?: string
    jump?: string
    slide?: string
    collect?: string
    collision?: string
    gameOver?: string
    backgroundMusic?: string
  }
}

export interface ObstacleDefinition {
  key: string
  position: 'ground' | 'overhead'
  offsetFromGround: number
  width: number
  height: number
  color: string
  weight: number
  hitbox: HitboxConfig
}

export interface CollectibleDefinition {
  key: string
  size: number
  value: number
  color: string
  weight: number
}

export interface ParallaxLayer {
  assetKey: 'background' | 'ground'
  color: string
  speedMultiplier: number
  height: number
}

export interface ThemeConfig {
  title: string
  themeName: string
  colors: {
    sky: string
    ground: string
    groundLine: string
    player: string
    playerDetail: string
    text: string
    obstacle: string
    collectible: string
    overlay: string
  }
  obstacles: ObstacleDefinition[]
  collectibles: CollectibleDefinition[]
  environment: {
    layers: ParallaxLayer[]
  }
}

export interface GameConfig {
  canvas: {
    width: number
    height: number
    maxDevicePixelRatio: number
    maxFrameRate: number
    maxDeltaSeconds: number
  }
  movement: {
    startSpeed: number
    minSpeed: number
    maxSpeed: number
    acceleration: number
  }
  physics: {
    gravity: number
    jumpForce: number
  }
  player: {
    startX: number
    width: number
    height: number
    slideHeight: number
    slideDuration: number
    hitbox: HitboxConfig
  }
  spawning: {
    minObstacleSpacing: number
    maxObstacleSpacing: number
    minCollectibleSpacing: number
    maxCollectibleSpacing: number
    collectibleGroupSize: number
    collectibleHeightAboveGroundMin: number
    collectibleHeightAboveGroundMax: number
    collectibleArcHeight: number
  }
  difficulty: {
    speedIncreaseEveryDistance: number
  }
  environment: {
    groundHeight: number
  }
  scoring: {
    storageKey: string
  }
  controls: {
    swipeThreshold: number
    pauseWhenHidden: boolean
  }
}

export interface LoadedAssets {
  images: Map<string, HTMLImageElement>
  sprites: Map<string, SpriteAsset>
}

export interface HudData {
  score: number
  bestScore: number
}

export interface EngineCallbacks {
  onStateChange: (state: GameState) => void
  onHudChange: (hud: HudData) => void
  onSoundChange: (muted: boolean) => void
  onError: (message: string) => void
}
