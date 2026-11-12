import type { ThemeConfig } from '../types'

export const themeConfig: ThemeConfig = {
  title: 'Endless Runner',
  themeName: 'Orange Daylight',
  colors: {
    sky: '#fff8ef',
    ground: '#fed9b5',
    groundLine: '#e9a365',
    player: '#ff7900',
    playerDetail: '#1d2b42',
    text: '#1d2b42',
    obstacle: '#39845b',
    collectible: '#ffc247',
    overlay: 'rgba(23, 35, 54, 0.72)',
  },
  obstacles: [
    { key: 'obstacle1', position: 'ground', offsetFromGround: 0, width: 36, height: 54, color: '#39845b', weight: 5, hitbox: { x: 0.08, y: 0.05, width: 0.84, height: 0.9 } },
    { key: 'obstacle2', position: 'overhead', offsetFromGround: 70, width: 66, height: 42, color: '#5d7852', weight: 3, hitbox: { x: 0.06, y: 0.08, width: 0.88, height: 0.86 } },
    { key: 'obstacle3', position: 'ground', offsetFromGround: 0, width: 32, height: 74, color: '#d47737', weight: 2, hitbox: { x: 0.12, y: 0.04, width: 0.76, height: 0.92 } },
  ],
  collectibles: [
    { key: 'collectible1', size: 28, value: 10, color: '#ffc247', weight: 6 },
    { key: 'collectible2', size: 32, value: 25, color: '#74c8d8', weight: 2 },
  ],
  environment: {
    layers: [
      { assetKey: 'background', color: '#ffe5c9', speedMultiplier: 0.12, height: 0.58 },
      { assetKey: 'ground', color: '#fed9b5', speedMultiplier: 1, height: 1 },
    ],
  },
}

export default themeConfig
