# Pong

Local two-player Pong in the browser. Both players share one keyboard on the same screen.

## Stack

- Vite + React 19 + TypeScript
- HTML Canvas 2D for rendering
- Tailwind CSS for UI
- Vitest for physics unit tests

## Getting Started

**Prerequisites:** Node.js 20+

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Controls

| Player | Side | Up | Down |
|--------|------|----|------|
| Player 1 | Left | `W` | `S` |
| Player 2 | Right | `↑` | `↓` |

First to **11** points wins.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run test` | Run Vitest unit tests |
| `npm run lint` | Run oxlint |
| `npm run format` | Format with Prettier |

## Project Structure

```
src/
├── components/   # UI shell (start screen, canvas wrapper, score)
├── game/         # Pure game logic (physics, engine, renderer)
└── hooks/        # useGameInput, useGameLoop
```

Game physics lives in `src/game/physics.ts` as pure functions. The `GameEngine` class runs the `requestAnimationFrame` loop. React handles only the menu and overlays.

## Cursor Rules

Project conventions for AI assistance are in `.cursor/rules/`.
