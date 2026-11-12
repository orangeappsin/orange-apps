# Reusable Endless Runner

This project includes a lightweight, configuration-driven HTML Canvas runner. The engine is shared between themes; a new game should normally need only new assets and configuration values, not changes to physics, collision, scoring, or the game loop.

## Run the project

From `frontend/`:

```sh
npm install
npm run dev
```

Create a production build with `npm run build`. The game is available at `/endless-runner`.

## Engine structure

- `src/game-engine/engine/GameEngine.ts` owns lifecycle, input, and coordination.
- `GameLoop.ts` runs the capped `requestAnimationFrame` loop and delta-time updates.
- `Renderer.ts` draws the player, obstacles, collectibles, and the canvas scene.
- `PlayerController.ts` handles jump and slide physics.
- `ObstacleManager.ts` and `CollectibleManager.ts` spawn and pool game objects.
- `Collision.ts` provides configurable rectangle hitboxes.
- `ScoreManager.ts` tracks run distance for difficulty progression, collectible points, and the persisted best score.
- `BackgroundManager.ts` scrolls the environment layers.
- `utils/AssetLoader.ts`, `AudioManager.ts`, and `ObjectPool.ts` provide shared asset and resource handling.
- `src/pages/EndlessRunner.tsx` provides menus, overlays, responsive HUD, and touch controls.

The renderer uses placeholder shapes when no asset is configured or an asset fails to load. Image-loading failures are reported in the game UI; missing files do not prevent play.

## Create another game

1. Replace the files in the relevant `public/assets/endless-runner/` subfolder. Keep their filenames to avoid changing any code.
2. Update `src/game-engine/config/themeConfig.ts` with the title, colors, obstacles, collectibles, and environment layers as needed.
3. Update `src/game-engine/config/gameConfig.ts` for canvas size, controls, speed, physics, spacing, scoring, and difficulty.
4. Open `/endless-runner` and test the new theme.

Assets are grouped by type under `public/assets/endless-runner/`: `player/` contains the player sprites, `obstacles/` contains obstacle images, `collectibles/` contains collectible images, `environment/` contains background and ground textures, and `audio/` contains sound effects. Replace a file with one of the same name to reskin the game or change a sound without editing code. The run sprite is a four-frame horizontal sprite sheet; keep each frame 96 × 112 pixels or update its frame metadata in the config.

Example sprite-sheet configuration (frames are arranged horizontally):

```ts
run: {
  src: '/assets/jungle/runner-run.png',
  frameWidth: 96,
  frameHeight: 112,
  frameCount: 6,
  framesPerSecond: 12,
}
```

Example theme obstacle:

```ts
{
  key: 'obstacle1',
  position: 'ground',
  offsetFromGround: 0,
  width: 48,
  height: 66,
  color: '#456b35',
  weight: 4,
  hitbox: { x: 0.1, y: 0.08, width: 0.8, height: 0.88 },
}
```

`key` matches the asset key in `assetConfig.ts`. Set `position` to `overhead` and increase `offsetFromGround` for a barrier that can be avoided by sliding. Obstacle groups are spawned one at a time with configurable minimum and maximum spacing to avoid tightly packed, impossible combinations.

## Replace assets and sounds

All asset paths are centralized in `assetConfig.ts` and point to the corresponding subfolders in `public/assets/endless-runner/`:

- `player.run`, `player.jump`, and `player.slide` accept sprite-sheet paths and frame metadata.
- `obstacles` and `collectibles` map the generic theme keys to image paths.
- `environment.background` and `environment.ground` are repeated as scrolling textures.
- `audio` contains replaceable `start`, `run`, `jump`, `slide`, `collect`, `collision`, and `gameOver` sound paths, plus optional background music.

The sample effects are short WAV clips that play when a run starts, while the player is moving, on jump or slide, on collectible pickup, on collision, and on game over. The `run.wav` clip loops only during gameplay. For a quick reskin, replace files in the matching subfolder with the same filenames. No engine or config changes are needed. To use different filenames or formats, update the matching path in `assetConfig.ts`.

Leave a path empty to use a canvas-drawn placeholder or no sound. Audio begins after the player interacts with the game to comply with browser autoplay restrictions. Sound can be muted from the game toolbar.

## Tune gameplay

In `gameConfig.ts`, adjust:

- `canvas`: logical dimensions, maximum device-pixel ratio, frame-rate cap, and maximum delta.
- `movement`: start/min/max speed and acceleration.
- `physics`: gravity and jump force.
- `player`: starting position, dimensions, sliding duration, and collision hitbox.
- `environment`: ground height.
- `spawning`: obstacle and collectible spacing, group size, collectible height, and arc.
- `difficulty`: distance between speed increases.
- `scoring`: localStorage key for the best collectible score.
- `controls`: swipe threshold and pause-on-hidden behavior.

In `themeConfig.ts`, each obstacle has a size, position, display color, selection weight, and normalized hitbox. Collectibles have configurable size, value, color, and selection weight. Environment layers have their own color, height, image key, and parallax speed multiplier.

The best score is stored in the browser's localStorage. It is scoped by `scoring.storageKey`.

## Controls and game states

- Space / Arrow Up: jump.
- Arrow Down: slide.
- Escape: pause or resume.
- Tap the canvas: jump.
- Swipe down on the canvas: slide.
- On-screen Jump and Slide buttons are available during play.

The game implements Loading, Main Menu, Playing, Paused, and Game Over states, with restart, play again, main menu, pause/resume, sound toggle, current score, and best score controls. Switching away from the tab pauses an active run.

## Theme-only files and engine files

For a normal visual or difficulty variant, edit only:

- `src/game-engine/config/assetConfig.ts`
- `src/game-engine/config/themeConfig.ts`
- `src/game-engine/config/gameConfig.ts`

The reusable engine under `src/game-engine/engine/` and `src/game-engine/utils/` should not need changes for a theme swap. `src/pages/EndlessRunner.tsx` and its CSS are the shared game UI; edit them only when intentionally changing the controls or menu design.
