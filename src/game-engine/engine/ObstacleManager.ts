import { ObjectPool } from '../utils/ObjectPool'
import { overlapsHitbox } from './Collision'
import type { GameConfig, ObstacleDefinition, Rectangle } from '../types'

export interface Obstacle {
  definition: ObstacleDefinition | null
  x: number
  width: number
  height: number
  active: boolean
}

export class ObstacleManager {
  private readonly definitions: ObstacleDefinition[]
  private readonly config: GameConfig['spawning']
  private readonly canvasWidth: number
  private readonly groundY: number
  private readonly active: Obstacle[] = []
  private readonly pool = new ObjectPool<Obstacle>(() => ({
    definition: null,
    x: 0,
    width: 0,
    height: 0,
    active: false,
  }))
  private spawnDistance = 0

  constructor(
    definitions: ObstacleDefinition[],
    config: GameConfig['spawning'],
    canvasWidth: number,
    groundY: number,
  ) {
    this.definitions = definitions
    this.config = config
    this.canvasWidth = canvasWidth
    this.groundY = groundY
  }

  reset(): void {
    for (const obstacle of this.active) this.pool.release(obstacle)
    this.active.length = 0
    this.spawnDistance = this.randomSpacing()
  }

  update(deltaSeconds: number, speed: number): void {
    this.spawnDistance -= speed * deltaSeconds
    if (this.spawnDistance <= 0 && this.definitions.length > 0) {
      this.spawn()
      this.spawnDistance = this.randomSpacing()
    }

    for (let index = this.active.length - 1; index >= 0; index -= 1) {
      const obstacle = this.active[index]
      obstacle.x -= speed * deltaSeconds
      if (obstacle.x + obstacle.width < 0) {
        this.active[index] = this.active[this.active.length - 1]
        this.active.pop()
        obstacle.active = false
        this.pool.release(obstacle)
      }
    }
  }

  collidesWith(player: Rectangle): boolean {
    for (const obstacle of this.active) {
      if (!obstacle.definition) continue
      const { definition } = obstacle
      const y = this.groundY - obstacle.height - definition.offsetFromGround
      if (overlapsHitbox(player, obstacle.x, y, obstacle.width, obstacle.height, definition.hitbox)) return true
    }
    return false
  }

  get items(): readonly Obstacle[] {
    return this.active
  }

  private spawn(): void {
    const definition = pickWeighted(this.definitions)
    if (!definition) return
    const obstacle = this.pool.acquire()
    obstacle.definition = definition
    obstacle.x = this.canvasWidth + definition.width
    obstacle.width = definition.width
    obstacle.height = definition.height
    obstacle.active = true
    this.active.push(obstacle)
  }

  private randomSpacing(): number {
    return this.config.minObstacleSpacing
      + Math.random() * (this.config.maxObstacleSpacing - this.config.minObstacleSpacing)
  }
}

function pickWeighted<T extends { weight: number }>(items: T[]): T | undefined {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)
  let choice = Math.random() * totalWeight
  for (const item of items) {
    choice -= item.weight
    if (choice <= 0) return item
  }
  return items[items.length - 1]
}
