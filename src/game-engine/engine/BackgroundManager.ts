import type { LoadedAssets, ParallaxLayer, ThemeConfig } from '../types'

export class BackgroundManager {
  private readonly theme: ThemeConfig
  private readonly offsets: number[]
  private readonly groundLayer: ParallaxLayer | undefined
  private groundOffset = 0

  constructor(theme: ThemeConfig) {
    this.theme = theme
    this.offsets = theme.environment.layers.map(() => 0)
    this.groundLayer = theme.environment.layers.find((layer) => layer.assetKey === 'ground')
  }

  reset(): void {
    this.offsets.fill(0)
    this.groundOffset = 0
  }

  update(deltaSeconds: number, speed: number): void {
    for (let index = 0; index < this.theme.environment.layers.length; index += 1) {
      this.offsets[index] += speed * this.theme.environment.layers[index].speedMultiplier * deltaSeconds
    }
    this.groundOffset = (this.groundOffset + speed * deltaSeconds) % 80
  }

  draw(
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    groundY: number,
    assets: LoadedAssets,
  ): void {
    context.fillStyle = this.theme.colors.sky
    context.fillRect(0, 0, width, height)

    for (let index = 0; index < this.theme.environment.layers.length; index += 1) {
      const layer = this.theme.environment.layers[index]
      if (layer.assetKey === 'ground') continue
      this.drawBackgroundLayer(context, layer, this.offsets[index], width, height, groundY, assets)
    }

    this.drawGround(context, width, height, groundY, assets)
  }

  private drawBackgroundLayer(
    context: CanvasRenderingContext2D,
    layer: ParallaxLayer,
    offset: number,
    width: number,
    height: number,
    groundY: number,
    assets: LoadedAssets,
  ): void {
    const image = assets.images.get(layer.assetKey)
    if (image) {
      const layerHeight = Math.min(groundY, height * layer.height)
      const scale = layerHeight / image.height
      const tileWidth = image.width * scale
      if (tileWidth > 0) {
        const startX = -(offset % tileWidth)
        for (let x = startX; x < width; x += tileWidth) {
          context.drawImage(image, x, groundY - layerHeight, tileWidth, layerHeight)
        }
        return
      }
    }

    context.fillStyle = layer.color
    context.beginPath()
    context.moveTo(0, groundY)
    const horizon = groundY - height * (1 - layer.height)
    context.lineTo(0, horizon + 54)
    context.quadraticCurveTo(width * 0.19, horizon - 22, width * 0.37, horizon + 46)
    context.quadraticCurveTo(width * 0.66, horizon - 38, width, horizon + 25)
    context.lineTo(width, groundY)
    context.closePath()
    context.fill()

    context.fillStyle = 'rgba(255, 255, 255, 0.28)'
    context.beginPath()
    context.arc(width * 0.78, height * 0.2, Math.min(36, height * 0.07), 0, Math.PI * 2)
    context.fill()
  }

  private drawGround(
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    groundY: number,
    assets: LoadedAssets,
  ): void {
    const image = assets.images.get('ground')
    context.fillStyle = this.groundLayer?.color ?? this.theme.colors.ground
    context.fillRect(0, groundY, width, height - groundY)

    if (image) {
      const scale = Math.max(1, (height - groundY) / image.height)
      const tileWidth = image.width * scale
      const startX = -(this.groundOffset % tileWidth)
      for (let x = startX; x < width; x += tileWidth) {
        context.drawImage(image, x, groundY, tileWidth, height - groundY)
      }
    } else {
      context.fillStyle = this.theme.colors.groundLine
      context.fillRect(0, groundY, width, 4)
      context.globalAlpha = 0.3
      for (let x = -this.groundOffset; x < width; x += 80) {
        context.fillRect(x, groundY + 28, 35, 3)
      }
      context.globalAlpha = 1
    }
  }
}
