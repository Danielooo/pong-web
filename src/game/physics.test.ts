import { describe, expect, it } from 'vitest'
import {
  CANVAS_WIDTH,
  LEFT_PADDLE_X_MAX,
  RIGHT_PADDLE_X_MIN,
} from './constants'
import {
  createInitialState,
  frozenBallAtCenter,
  launchBall,
  tick,
} from './physics'
import type { Inputs } from './types'

const NO_INPUT: Inputs = {
  player1: { vertical: 'none', horizontal: 'none' },
  player2: { vertical: 'none', horizontal: 'none' },
}

describe('physics', () => {
  it('creates a valid initial state', () => {
    const state = createInitialState()
    expect(state.status).toBe('idle')
    expect(state.scores).toEqual([0, 0])
    expect(state.paddles).toHaveLength(2)
    expect(state.serveCountdown).toBeNull()
  })

  it('moves the left paddle up with W input', () => {
    const state = { ...createInitialState(), status: 'playing' as const }
    state.ball = launchBall()
    const startY = state.paddles[0].y
    const next = tick(state, {
      ...NO_INPUT,
      player1: { vertical: 'up', horizontal: 'none' },
    })
    expect(next.paddles[0].y).toBeLessThan(startY)
  })

  it('moves the left paddle right on the X-axis', () => {
    const state = { ...createInitialState(), status: 'playing' as const }
    state.ball = launchBall()
    const startX = state.paddles[0].x
    const next = tick(state, {
      ...NO_INPUT,
      player1: { vertical: 'none', horizontal: 'right' },
    })
    expect(next.paddles[0].x).toBeGreaterThan(startX)
  })

  it('clamps left paddle X within its half of the court', () => {
    const state = { ...createInitialState(), status: 'playing' as const }
    state.ball = launchBall()
    state.paddles[0].x = LEFT_PADDLE_X_MAX
    const next = tick(state, {
      ...NO_INPUT,
      player1: { vertical: 'none', horizontal: 'right' },
    })
    expect(next.paddles[0].x).toBe(LEFT_PADDLE_X_MAX)
  })

  it('clamps right paddle X within its half of the court', () => {
    const state = { ...createInitialState(), status: 'playing' as const }
    state.ball = launchBall()
    state.paddles[1].x = RIGHT_PADDLE_X_MIN
    const next = tick(state, {
      ...NO_INPUT,
      player2: { vertical: 'none', horizontal: 'left' },
    })
    expect(next.paddles[1].x).toBe(RIGHT_PADDLE_X_MIN)
  })

  it('scores for player 2 when ball exits left and enters serving', () => {
    const state = { ...createInitialState(), status: 'playing' as const }
    state.ball = { ...frozenBallAtCenter(), x: -20, vx: 0, vy: 0 }
    const next = tick(state, NO_INPUT)
    expect(next.scores).toEqual([0, 1])
    expect(next.status).toBe('serving')
    expect(next.ball.vx).toBe(0)
    expect(next.ball.vy).toBe(0)
    expect(next.serveCountdown).toBe(3)
  })

  it('ends the game when a player reaches win score', () => {
    const state = { ...createInitialState(), status: 'playing' as const }
    state.scores = [10, 0]
    state.ball = { ...frozenBallAtCenter(), x: CANVAS_WIDTH + 1, vx: 0, vy: 0 }
    const next = tick(state, NO_INPUT)
    expect(next.status).toBe('gameover')
    expect(next.winner).toBe(1)
  })

  it('is a no-op when paused', () => {
    const state = { ...createInitialState(), status: 'paused' as const }
    state.ball = launchBall()
    const next = tick(state, {
      player1: { vertical: 'up', horizontal: 'none' },
      player2: { vertical: 'down', horizontal: 'none' },
    })
    expect(next).toEqual(state)
  })

  it('increases ball speed after paddle bounce', () => {
    const state = { ...createInitialState(), status: 'playing' as const }
    state.ball = {
      x: 28,
      y: 260,
      vx: -5,
      vy: 0,
    }
    const beforeSpeed = Math.hypot(state.ball.vx, state.ball.vy)
    const next = tick(state, NO_INPUT)
    const afterSpeed = Math.hypot(next.ball.vx, next.ball.vy)
    expect(afterSpeed).toBeGreaterThan(beforeSpeed)
    expect(next.ball.vx).toBeGreaterThan(0)
  })
})
