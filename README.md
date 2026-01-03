# Dino Game

A Chrome Dino Game clone built with TypeScript. Can be used as a React component or embedded as a standalone vanilla JS game.

![Dino Game Preview](./assets/DinoStart.png)

## Features

- Classic Chrome Dino game
- Multiple dinosaur animations (running, jumping, ducking)
- Various obstacle types (cacti, birds)
- Keyboard and click/tap controls
- Custom assets drawn in pixelart

## Installation

### NPM (for React projects)

```bash
npm install @aurorameiliankarlsen/dino-game
```

### CDN (for vanilla JS)

```html
<script src="https://unpkg.com/@aurorameiliankarlsen/dino-game/dist/dino-game.umd.js"></script>
```

## Usage

### React Component

```tsx
import { DinoGame } from '@aurorameiliankarlsen/dino-game';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Play Dino Game</button>
      <DinoGame 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}
```

### With custom asset path

```tsx
<DinoGame 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  assetPath="/my-custom-path/dino"
/>
```

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <title>Dino Game</title>
  <link rel="stylesheet" href="dino-game.css">
</head>
<body>
  <div id="dino-game-container"></div>
  <script src="dino-game.js"></script>
  <script>
    DinoGame.init('dino-game-container', {
      assetPath: './assets'
    });
  </script>
</body>
</html>
```

## Controls

| Key | Action |
|-----|--------|
| `Space` / `↑` | Jump / Start game |
| `↓` | Duck |
| `Escape` | Close game |
| `Click/Tap` | Jump / Start game |

## Props (React)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | required | Controls modal visibility |
| `onClose` | `() => void` | required | Callback when game is closed |
| `assetPath` | `string` | `/dino` | Path to asset images |

## Assets

The game requires the following assets in your asset path:

```
/dino/
├── DinoStart.png
├── DinoLeftUp.png
├── DinoRightUp.png
├── DinoDuckLeftUp.png
├── DinoDuckRightUp.png
├── bird.png
├── cactusBig.png
├── cactusRound.png
├── cactusSmall.png
└── cactiBigAndSmall.png
```

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Run demo
npm run demo
```

## License

MIT © Aurora Meilian Karlsen

---

*Inspired by the Google Chrome Dinosaur Game* 

