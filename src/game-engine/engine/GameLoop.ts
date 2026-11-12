import type { GameConfig } from '../types'

export class GameLoop {
  private readonly config: GameConfig['canvas']
  private readonly update: (deltaSeconds: number, timestamp: number) => void
  private frameId = 0
  private previousTimestamp = 0
  private lastUpdateTimestamp = 0
  private running = false

  constructor(
    config: GameConfig['canvas'],
    update: (deltaSeconds: number, timestamp: number) => void,
  ) {
    this.config = config
    this.update = update
  }

  start(): void {
    if (this.running) return
    this.running = true
    this.previousTimestamp = 0
    this.lastUpdateTimestamp = 0
    this.frameId = window.requestAnimationFrame(this.frame)
  }

  stop(): void {
    this.running = false
    window.cancelAnimationFrame(this.frameId)
  }

  private readonly frame = (timestamp: number): void => {
    if (!this.running) return

    const frameInterval = 1000 / this.config.maxFrameRate
    if (!this.previousTimestamp || timestamp - this.previousTimestamp >= frameInterval) {
      const elapsed = this.lastUpdateTimestamp ? (timestamp - this.lastUpdateTimestamp) / 1000 : 1 / this.config.maxFrameRate
      const deltaSeconds = Math.min(elapsed, this.config.maxDeltaSeconds)
      this.lastUpdateTimestamp = timestamp
      this.previousTimestamp = timestamp - ((timestamp - this.previousTimestamp) % frameInterval)
      this.update(deltaSeconds, timestamp)
    }

    if (this.running) this.frameId = window.requestAnimationFrame(this.frame)
  }
}
