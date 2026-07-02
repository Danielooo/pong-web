import {
  BALL_SIZE,
  BALL_SPEED,
  BALL_SPEED_INCREASE,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  LEFT_PADDLE_X_MAX,
  LEFT_PADDLE_X_MIN,
  MAX_BALL_SPEED,
  PADDLE_HEIGHT,
  PADDLE_MARGIN,
  PADDLE_SPEED,
  PADDLE_WIDTH,
  RIGHT_PADDLE_X_MAX,
  RIGHT_PADDLE_X_MIN,
  SERVE_COUNTDOWN_SECONDS,
  WIN_SCORE,
} from './constants'
import type { Ball, GameState, Inputs, Paddle } from './types'

export function createInitialState(): GameState {
  return {
    ball: frozenBallAtCenter(),
    paddles: [createPaddle('left'), createPaddle('right')],
    scores: [0, 0],
    status: 'idle',
    serveCountdown: null,
    winner: null,
  }
}

function createPaddle(side: 'left' | 'right'): Paddle {
  return {
    x: side === 'left' ? PADDLE_MARGIN : CANVAS_WIDTH - PADDLE_MARGIN - PADDLE_WIDTH,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
  }
}

export function frozenBallAtCenter(): Ball {
  return {
    x: CANVAS_WIDTH / 2 - BALL_SIZE / 2,
    y: CANVAS_HEIGHT / 2 - BALL_SIZE / 2,
    vx: 0,
    vy: 0,
  }
}

export function launchBall(): Ball {
  const direction = Math.random() < 0.5 ? -1 : 1
  return {
    x: CANVAS_WIDTH / 2 - BALL_SIZE / 2,
    y: CANVAS_HEIGHT / 2 - BALL_SIZE / 2,
    vx: BALL_SPEED * direction,
    vy: (Math.random() * 2 - 1) * BALL_SPEED * 0.6,
  }
}

function movePaddle(
  paddle: Paddle,
  side: 'left' | 'right',
  input: Inputs['player1'],
): Paddle {
  let dx = 0
  let dy = 0
  if (input.vertical === 'up') dy -= PADDLE_SPEED
  if (input.vertical === 'down') dy += PADDLE_SPEED
  if (input.horizontal === 'left') dx -= PADDLE_SPEED
  if (input.horizontal === 'right') dx += PADDLE_SPEED

  if (dx !== 0 && dy !== 0) {
    dx *= Math.SQRT1_2
    dy *= Math.SQRT1_2
  }

  const minX = side === 'left' ? LEFT_PADDLE_X_MIN : RIGHT_PADDLE_X_MIN
  const maxX = side === 'left' ? LEFT_PADDLE_X_MAX : RIGHT_PADDLE_X_MAX
  const maxY = CANVAS_HEIGHT - PADDLE_HEIGHT

  return {
    ...paddle,
    x: Math.max(minX, Math.min(maxX, paddle.x + dx)),
    y: Math.max(0, Math.min(maxY, paddle.y + dy)),
  }
}

export function tickPaddles(state: GameState, inputs: Inputs): GameState {
  return {
    ...state,
    paddles: [
      movePaddle(state.paddles[0], 'left', inputs.player1),
      movePaddle(state.paddles[1], 'right', inputs.player2),
    ],
  }
}

function moveBall(ball: Ball): Ball {
  return {
    ...ball,
    x: ball.x + ball.vx,
    y: ball.y + ball.vy,
  }
}

function bounceOffWalls(ball: Ball): Ball {
  if (ball.y <= 0 || ball.y + BALL_SIZE >= CANVAS_HEIGHT) {
    return { ...ball, vy: -ball.vy }
  }
  return ball
}

function applySpeedIncrease(vx: number, vy: number): { vx: number; vy: number } {
  const speed = Math.hypot(vx, vy)
  const newSpeed = Math.min(speed * BALL_SPEED_INCREASE, MAX_BALL_SPEED)
  if (speed === 0) return { vx, vy }
  return {
    vx: (vx / speed) * newSpeed,
    vy: (vy / speed) * newSpeed,
  }
}

function bounceOffPaddle(ball: Ball, paddle: Paddle): Ball {
  const paddleCenter = paddle.y + PADDLE_HEIGHT / 2
  const ballCenter = ball.y + BALL_SIZE / 2
  const offset = (ballCenter - paddleCenter) / (PADDLE_HEIGHT / 2)
  const speed = Math.hypot(ball.vx, ball.vy)
  const vy = offset * speed
  const vx = -ball.vx
  const boosted = applySpeedIncrease(vx, vy)

  return {
    ...ball,
    vx: boosted.vx,
    vy: boosted.vy,
    x: ball.vx > 0 ? paddle.x - BALL_SIZE : paddle.x + PADDLE_WIDTH,
  }
}

function collidesWithPaddle(ball: Ball, paddle: Paddle): boolean {
  return (
    ball.x < paddle.x + PADDLE_WIDTH &&
    ball.x + BALL_SIZE > paddle.x &&
    ball.y < paddle.y + PADDLE_HEIGHT &&
    ball.y + BALL_SIZE > paddle.y
  )
}

function handlePaddleCollisions(ball: Ball, paddles: [Paddle, Paddle]): Ball {
  const [left, right] = paddles
  if (ball.vx < 0 && collidesWithPaddle(ball, left)) {
    return bounceOffPaddle(ball, left)
  }
  if (ball.vx > 0 && collidesWithPaddle(ball, right)) {
    return bounceOffPaddle(ball, right)
  }
  return ball
}

type ScoringResult = {
  ball: Ball
  scores: [number, number]
  scored: boolean
}

function handleScoring(ball: Ball, scores: [number, number]): ScoringResult {
  if (ball.x + BALL_SIZE < 0) {
    return {
      ball: frozenBallAtCenter(),
      scores: [scores[0], scores[1] + 1],
      scored: true,
    }
  }
  if (ball.x > CANVAS_WIDTH) {
    return {
      ball: frozenBallAtCenter(),
      scores: [scores[0] + 1, scores[1]],
      scored: true,
    }
  }
  return { ball, scores, scored: false }
}

export function tick(state: GameState, inputs: Inputs): GameState {
  if (state.status !== 'playing') return state

  const paddles: [Paddle, Paddle] = [
    movePaddle(state.paddles[0], 'left', inputs.player1),
    movePaddle(state.paddles[1], 'right', inputs.player2),
  ]

  let ball = moveBall(state.ball)
  ball = bounceOffWalls(ball)
  ball = handlePaddleCollisions(ball, paddles)

  const { ball: scoredBall, scores, scored } = handleScoring(ball, state.scores)

  const leftScore = scores[0]
  const rightScore = scores[1]
  const winner =
    leftScore >= WIN_SCORE ? 1 : rightScore >= WIN_SCORE ? 2 : null

  if (winner) {
    return {
      ball: scoredBall,
      paddles,
      scores,
      status: 'gameover',
      serveCountdown: null,
      winner,
    }
  }

  if (scored) {
    return {
      ball: scoredBall,
      paddles,
      scores,
      status: 'serving',
      serveCountdown: SERVE_COUNTDOWN_SECONDS,
      winner: null,
    }
  }

  return {
    ball: scoredBall,
    paddles,
    scores,
    status: 'playing',
    serveCountdown: null,
    winner: null,
  }
}
