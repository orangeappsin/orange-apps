import type { AssetConfig } from '../types'

type AudioKey = keyof AssetConfig['audio']

export class AudioManager {
  private readonly sounds = new Map<AudioKey, HTMLAudioElement>()
  private readonly activeLoops = new Set<AudioKey>()
  private muted = false
  private musicRequested = false
  private onError: (message: string) => void = () => undefined

  load(config: AssetConfig['audio'], onError: (message: string) => void): void {
    this.onError = onError
    for (const [key, src] of Object.entries(config) as Array<[AudioKey, string | undefined]>) {
      if (!src) continue
      const audio = new Audio()
      audio.preload = 'auto'
      audio.src = src
      audio.addEventListener('error', () => onError(`Could not load game audio: ${src}`), { once: true })
      this.sounds.set(key, audio)
      audio.load()
    }
  }

  play(key: AudioKey): void {
    if (this.muted) return
    const sound = this.sounds.get(key)
    if (!sound) return
    sound.loop = false
    sound.currentTime = 0
    void sound.play().catch((error: unknown) => this.reportPlaybackError(key, error))
  }

  playLoop(key: AudioKey): void {
    this.activeLoops.add(key)
    if (this.muted) return
    const sound = this.sounds.get(key)
    if (!sound) return
    sound.loop = true
    if (sound.paused) {
      sound.currentTime = 0
      void sound.play().catch((error: unknown) => this.reportPlaybackError(key, error))
    }
  }

  stopLoop(key: AudioKey): void {
    this.activeLoops.delete(key)
    const sound = this.sounds.get(key)
    if (!sound) return
    sound.pause()
    sound.currentTime = 0
  }

  startMusic(): void {
    this.musicRequested = true
    const music = this.sounds.get('backgroundMusic')
    if (!music || this.muted) return
    music.loop = true
    if (music.paused) void music.play().catch((error: unknown) => this.reportPlaybackError('backgroundMusic', error))
  }

  pauseMusic(): void {
    this.musicRequested = false
    this.sounds.get('backgroundMusic')?.pause()
  }

  setMuted(muted: boolean): void {
    this.muted = muted
    if (muted) {
      for (const sound of this.sounds.values()) sound.pause()
    } else {
      for (const key of this.activeLoops) this.playLoop(key)
      if (this.musicRequested) this.startMusic()
    }
  }

  isMuted(): boolean {
    return this.muted
  }

  dispose(): void {
    for (const sound of this.sounds.values()) {
      sound.pause()
      sound.removeAttribute('src')
      sound.load()
    }
    this.sounds.clear()
    this.activeLoops.clear()
  }

  private reportPlaybackError(key: AudioKey, error: unknown): void {
    const reason = error instanceof Error ? error.message : 'Unknown audio playback error.'
    this.onError(`Could not play "${key}" sound: ${reason}`)
  }
}
