import type { GameConfig, HudData } from '../types'

export class ScoreManager {
  private readonly config: GameConfig['scoring']
  private distance = 0
  private score = 0
  private bestScore = 0

  constructor(config: GameConfig['scoring']) {
    this.config = config
    this.bestScore = this.readBestScore()
  }

  reset(): void {
    this.distance = 0
    this.score = 0
  }

  trackDistance(distance: number): void {
    this.distance += distance
  }

  addPoints(points: number): void {
    this.setScore(this.score + points)
  }

  get hud(): HudData {
    return { score: this.score, bestScore: this.bestScore }
  }

  get currentScore(): number {
    return this.score
  }

  get currentBestScore(): number {
    return this.bestScore
  }

  get distanceTraveled(): number {
    return this.distance
  }

  private setScore(score: number): void {
    this.score = score
    if (score <= this.bestScore) return
    this.bestScore = score
    try {
      window.localStorage.setItem(this.config.storageKey, String(score))
    } catch (error) {
      console.warn('Unable to save the runner best score.', error)
    }
  }

  private readBestScore(): number {
    try {
      const saved = Number(window.localStorage.getItem(this.config.storageKey))
      return Number.isFinite(saved) && saved > 0 ? saved : 0
    } catch (error) {
      console.warn('Unable to read the runner best score.', error)
      return 0
    }
  }
}
