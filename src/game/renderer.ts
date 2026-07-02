import {
  BALL_SIZE,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
} from './constants'
import type { GameState } from './types'

export function render(ctx: CanvasRenderingContext2D, state: GameState): void {
  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  ctx.strokeStyle = '#333'
  ctx.setLineDash([8, 8])
  ctx.beginPath()
  ctx.moveTo(CANVAS_WIDTH / 2, 0)
  ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT)
  ctx.stroke()
  ctx.setLineDash([])

  ctx.fillStyle = '#f5f5f5'
  for (const paddle of state.paddles) {
    ctx.fillRect(paddle.x, paddle.y, PADDLE_WIDTH, PADDLE_HEIGHT)
  }

  ctx.fillRect(state.ball.x, state.ball.y, BALL_SIZE, BALL_SIZE)

  if (state.status === 'serving' && state.serveCountdown !== null) {
    drawServeCountdown(ctx, state.serveCountdown)
  } else if (state.status === 'paused') {
    drawPausedOverlay(ctx)
  } else if (state.status === 'gameover' && state.winner !== null) {
    drawGameOverOverlay(ctx, state.winner)
  }
}

function drawServeCountdown(ctx: CanvasRenderingContext2D, countdown: number): void {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  ctx.fillStyle = '#f5f5f5'
  ctx.font = 'bold 96px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(countdown), CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
}

function drawPausedOverlay(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  ctx.fillStyle = '#f5f5f5'
  ctx.font = 'bold 48px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20)

  ctx.font = '16px system-ui, sans-serif'
  ctx.fillStyle = '#a3a3a3'
  ctx.fillText('Press Esc to resume', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30)
}

function drawGameOverOverlay(ctx: CanvasRenderingContext2D, winner: 1 | 2): void {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  ctx.fillStyle = '#f5f5f5'
  ctx.font = 'bold 42px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(`Player ${winner} Wins!`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30)

  ctx.font = '16px system-ui, sans-serif'
  ctx.fillStyle = '#a3a3a3'
  ctx.fillText('Press R to play again', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20)
}
