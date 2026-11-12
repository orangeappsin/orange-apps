import type { GameConfig, Rectangle } from '../types'

export class PlayerController {
  private readonly config: GameConfig['player'] & GameConfig['physics']
  private readonly groundY: number
  private readonly collisionBounds: Rectangle = { x: 0, y: 0, width: 0, height: 0 }
  private readonly renderBounds: Rectangle = { x: 0, y: 0, width: 0, height: 0 }
  private jumpHeight = 0
  private verticalVelocity = 0
  private slideRemaining = 0

  constructor(
    config: GameConfig['player'] & GameConfig['physics'],
    groundY: number,
  ) {
    this.config = config
    this.groundY = groundY
  }

  reset(): void {
    this.jumpHeight = 0
    this.verticalVelocity = 0
    this.slideRemaining = 0
  }

  jump(): boolean {
    if (this.jumpHeight > 0 || this.verticalVelocity > 0) return false
    this.slideRemaining = 0
    this.verticalVelocity = this.config.jumpForce
    return true
  }

  slide(): boolean {
    if (this.jumpHeight > 0) return false
    this.slideRemaining = this.config.slideDuration
    return true
  }

  update(deltaSeconds: number): void {
    this.slideRemaining = Math.max(0, this.slideRemaining - deltaSeconds)
    if (this.jumpHeight <= 0 && this.verticalVelocity <= 0) {
      this.jumpHeight = 0
      this.verticalVelocity = 0
      return
    }
    this.jumpHeight += this.verticalVelocity * deltaSeconds
    this.verticalVelocity -= this.config.gravity * deltaSeconds
    if (this.jumpHeight < 0) {
      this.jumpHeight = 0
      this.verticalVelocity = 0
    }
  }

  get isSliding(): boolean {
    return this.slideRemaining > 0
  }

  get height(): number {
    return this.isSliding ? this.config.slideHeight : this.config.height
  }

  get bounds(): Rectangle {
    const height = this.height
    this.collisionBounds.x = this.x + this.config.width * this.config.hitbox.x
    this.collisionBounds.y = this.groundY - height - this.jumpHeight + height * this.config.hitbox.y
    this.collisionBounds.width = this.config.width * this.config.hitbox.width
    this.collisionBounds.height = height * this.config.hitbox.height
    return this.collisionBounds
  }

  get drawBounds(): Rectangle {
    const height = this.height
    this.renderBounds.x = this.x
    this.renderBounds.y = this.groundY - height - this.jumpHeight
    this.renderBounds.width = this.config.width
    this.renderBounds.height = height
    return this.renderBounds
  }

  get airborne(): boolean {
    return this.jumpHeight > 0 || this.verticalVelocity > 0
  }

  get animationOffset(): number {
    return this.jumpHeight
  }

  get x(): number {
    return this.config.startX
  }
}
