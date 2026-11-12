import { ObjectPool } from '../utils/ObjectPool'
import { overlapsBounds } from './Collision'
import type { CollectibleDefinition, GameConfig, Rectangle } from '../types'

export interface Collectible {
  definition: CollectibleDefinition | null
  x: number
  y: number
  phase: number
  active: boolean
}

export class CollectibleManager {
  private readonly definitions: CollectibleDefinition[]
  private readonly config: GameConfig['spawning']
  private readonly canvasWidth: number
  private readonly groundY: number
  private readonly active: Collectible[] = []
  private readonly pool = new ObjectPool<Collectible>(() => ({
    definition: null,
    x: 0,
    y: 0,
    phase: 0,
    active: false,
  }))
  private spawnDistance = 0

  constructor(
    definitions: CollectibleDefinition[],
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
    for (const item of this.active) this.pool.release(item)
    this.active.length = 0
    this.spawnDistance = this.randomSpacing()
  }

  update(deltaSeconds: number, speed: number, player: Rectangle, onCollect: (value: number) => void): void {
    this.spawnDistance -= speed * deltaSeconds
    if (this.spawnDistance <= 0 && this.definitions.length > 0) {
      this.spawnGroup()
      this.spawnDistance = this.randomSpacing()
    }

    for (let index = this.active.length - 1; index >= 0; index -= 1) {
      const item = this.active[index]
      const size = item.definition?.size ?? 0
      item.x -= speed * deltaSeconds
      item.phase += deltaSeconds * 6

      if (overlapsBounds(player, item.x, item.y, size, size)) {
        onCollect(item.definition?.value ?? 0)
        this.releaseAt(index)
      } else if (item.x + size < 0) {
        this.releaseAt(index)
      }
    }
  }

  get items(): readonly Collectible[] {
    return this.active
  }

  private spawnGroup(): void {
    const definition = pickWeighted(this.definitions)
    if (!definition) return
    const count = Math.max(1, this.config.collectibleGroupSize)
    const heightRange = this.config.collectibleHeightAboveGroundMax - this.config.collectibleHeightAboveGroundMin
    const baseY = this.groundY - definition.size - this.config.collectibleHeightAboveGroundMin - Math.random() * heightRange

    for (let index = 0; index < count; index += 1) {
      const item = this.pool.acquire()
      item.definition = definition
      item.x = this.canvasWidth + index * (definition.size + 20)
      item.y = baseY - Math.sin((index / Math.max(count - 1, 1)) * Math.PI) * this.config.collectibleArcHeight
      item.phase = 0
      item.active = true
      this.active.push(item)
    }
  }

  private releaseAt(index: number): void {
    const item = this.active[index]
    this.active[index] = this.active[this.active.length - 1]
    this.active.pop()
    item.active = false
    this.pool.release(item)
  }

  private randomSpacing(): number {
    return this.config.minCollectibleSpacing
      + Math.random() * (this.config.maxCollectibleSpacing - this.config.minCollectibleSpacing)
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
