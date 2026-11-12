import type { HitboxConfig, Rectangle } from '../types'

export function overlapsBounds(
  rectangle: Rectangle,
  x: number,
  y: number,
  width: number,
  height: number,
): boolean {
  return rectangle.x < x + width
    && rectangle.x + rectangle.width > x
    && rectangle.y < y + height
    && rectangle.y + rectangle.height > y
}

export function overlapsHitbox(
  rectangle: Rectangle,
  x: number,
  y: number,
  width: number,
  height: number,
  hitbox: HitboxConfig,
): boolean {
  const hitboxX = x + width * hitbox.x
  const hitboxY = y + height * hitbox.y
  const hitboxWidth = width * hitbox.width
  const hitboxHeight = height * hitbox.height
  return overlapsBounds(rectangle, hitboxX, hitboxY, hitboxWidth, hitboxHeight)
}
