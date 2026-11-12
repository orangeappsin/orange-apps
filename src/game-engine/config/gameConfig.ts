import type { GameConfig } from '../types'

export const gameConfig: GameConfig = {
  canvas: {
    width: 960,
    height: 540,
    maxDevicePixelRatio: 2,
    maxFrameRate: 60,
    maxDeltaSeconds: 0.05,
  },
  movement: {
    startSpeed: 340,
    minSpeed: 340,
    maxSpeed: 700,
    acceleration: 9,
  },
  physics: {
    gravity: 2100,
    jumpForce: 760,
  },
  player: {
    startX: 138,
    width: 64,
    height: 82,
    slideHeight: 46,
    slideDuration: 0.58,
    hitbox: { x: 0.12, y: 0.08, width: 0.76, height: 0.84 },
  },
  spawning: {
    minObstacleSpacing: 300,
    maxObstacleSpacing: 520,
    minCollectibleSpacing: 460,
    maxCollectibleSpacing: 760,
    collectibleGroupSize: 4,
    collectibleHeightAboveGroundMin: 74,
    collectibleHeightAboveGroundMax: 138,
    collectibleArcHeight: 38,
  },
  difficulty: {
    speedIncreaseEveryDistance: 900,
  },
  environment: {
    groundHeight: 92,
  },
  scoring: {
    storageKey: 'orangeapps.endless-runner.best-score',
  },
  controls: {
    swipeThreshold: 32,
    pauseWhenHidden: true,
  },
}

export default gameConfig
