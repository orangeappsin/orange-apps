import type { AssetConfig } from '../types'

// Replace these paths to use sprite sheets and audio; empty values use engine placeholders.
export const assetConfig: AssetConfig = {
  player: {
    run: {
      src: '/assets/endless-runner/player/player-run.svg',
      frameWidth: 96,
      frameHeight: 112,
      frameCount: 4,
      framesPerSecond: 10,
    },
    jump: {
      src: '/assets/endless-runner/player/player-jump.svg',
      frameWidth: 96,
      frameHeight: 112,
      frameCount: 1,
      framesPerSecond: 1,
    },
    slide: {
      src: '/assets/endless-runner/player/player-slide.svg',
      frameWidth: 96,
      frameHeight: 112,
      frameCount: 1,
      framesPerSecond: 1,
    },
  },
  obstacles: {
    obstacle1: '/assets/endless-runner/obstacles/obstacle1.svg',
    obstacle2: '/assets/endless-runner/obstacles/obstacle2.svg',
    obstacle3: '/assets/endless-runner/obstacles/obstacle3.svg',
  },
  collectibles: {
    collectible1: '/assets/endless-runner/collectibles/collectible1.svg',
    collectible2: '/assets/endless-runner/collectibles/collectible2.svg',
  },
  environment: {
    background: '/assets/endless-runner/environment/background.svg',
    ground: '/assets/endless-runner/environment/ground.svg',
  },
  audio: {
    start: '/assets/endless-runner/audio/start.wav',
    run: '/assets/endless-runner/audio/run.wav',
    jump: '/assets/endless-runner/audio/jump.wav',
    slide: '/assets/endless-runner/audio/slide.wav',
    collect: '/assets/endless-runner/audio/collect.wav',
    collision: '/assets/endless-runner/audio/collision.wav',
    gameOver: '/assets/endless-runner/audio/game-over.wav',
    backgroundMusic: undefined,
  },
}

export default assetConfig
