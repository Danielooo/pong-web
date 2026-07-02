export type GameStatus = 'idle' | 'playing' | 'paused' | 'serving' | 'gameover'

export type VerticalInput = 'up' | 'down' | 'none'
export type HorizontalInput = 'left' | 'right' | 'none'

export type PlayerInput = {
  vertical: VerticalInput
  horizontal: HorizontalInput
}

export type Inputs = {
  player1: PlayerInput
  player2: PlayerInput
}

export type Paddle = {
  x: number
  y: number
}

export type Ball = {
  x: number
  y: number
  vx: number
  vy: number
}

export type GameState = {
  ball: Ball
  paddles: [Paddle, Paddle]
  scores: [number, number]
  status: GameStatus
  serveCountdown: number | null
  winner: 1 | 2 | null
}
