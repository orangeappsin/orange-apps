import type { AssetConfig, LoadedAssets, SpriteAsset } from '../types'

export class AssetLoader {
  async load(config: AssetConfig, onError: (message: string) => void): Promise<LoadedAssets> {
    const images = new Map<string, HTMLImageElement>()
    const sprites = new Map<string, SpriteAsset>()
    const requests: Array<{ key: string; src: string }> = []

    for (const [animation, sprite] of Object.entries(config.player)) {
      if (sprite?.src) {
        requests.push({ key: `player.${animation}`, src: sprite.src })
        sprites.set(`player.${animation}`, sprite)
      }
    }

    for (const [key, src] of Object.entries(config.obstacles)) {
      if (src) requests.push({ key: `obstacle.${key}`, src })
    }
    for (const [key, src] of Object.entries(config.collectibles)) {
      if (src) requests.push({ key: `collectible.${key}`, src })
    }
    if (config.environment.background) requests.push({ key: 'background', src: config.environment.background })
    if (config.environment.ground) requests.push({ key: 'ground', src: config.environment.ground })

    await Promise.all(requests.map(async ({ key, src }) => {
      try {
        const image = await this.loadImage(src)
        images.set(key, image)
      } catch {
        onError(`Could not load game image: ${src}`)
      }
    }))

    return { images, sprites }
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error(`Image failed to load: ${src}`))
      image.src = src
    })
  }
}
