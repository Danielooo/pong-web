import {
  createInitialState,
  launchBall,
  tick,
  tickPaddles,
} from './physics'
import { render } from './renderer'
import { SERVE_COUNTDOWN_SECONDS } from './constants'
import type { GameState, Inputs } from './types'

type StateListener = (state: GameState) => void

export class GameEngine {
  private state: GameState = createInitialState()
  private animationId: number | null = null
  private getInputs: () => Inputs = () => ({
    player1: 'none',
    player2: 'none',
  })
  private ctx: CanvasRenderingContext2D | null = null
  private listeners = new Set<StateListener>()
  private serveTimerStart: number | null = null

  setCanvasContext(ctx: CanvasRenderingContext2D): void {
    this.ctx = ctx
  }

  setInputProvider(getInputs: () => Inputs): void {
    this.getInputs = getInputs
  }

  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener)
    listener(this.state)
    return () => this.listeners.delete(listener)
  }

  getState(): GameState {
    return this.state
  }

  start(): void {
    if (this.animationId !== null) return
    this.state = {
      ...createInitialState(),
      status: 'serving',
      serveCountdown: SERVE_COUNTDOWN_SECONDS,
    }
    this.serveTimerStart = performance.now()
    this.notify()
    this.loop()
  }

  reset(): void {
    this.stop()
    this.serveTimerStart = null
    this.state = createInitialState()
    this.notify()
    if (this.ctx) {
      render(this.ctx, this.state)
    }
  }

  togglePause(): void {
    if (this.state.status === 'playing') {
      this.state = { ...this.state, status: 'paused' }
      this.notify()
    } else if (this.state.status === 'paused') {
      this.state = { ...this.state, status: 'playing' }
      this.notify()
    }
  }

  stop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  private loop = (): void => {
    const inputs = this.getInputs()

    if (this.state.status === 'playing') {
      this.state = tick(this.state, inputs)
      if (this.state.status === 'serving') {
        this.serveTimerStart = performance.now()
      }
    } else if (this.state.status === 'serving') {
      this.state = this.updateServing(inputs)
    } else if (this.state.status === 'paused') {
      // frozen — render only
    }

    this.notify()

    if (this.ctx) {
      render(this.ctx, this.state)
    }

    if (this.state.status === 'gameover') {
      this.animationId = null
      return
    }

    this.animationId = requestAnimationFrame(this.loop)
  }

  private updateServing(inputs: Inputs): GameState {
    let state = tickPaddles(this.state, inputs)

    if (this.serveTimerStart === null) {
      this.serveTimerStart = performance.now()
    }

    const elapsed = performance.now() - this.serveTimerStart
    const remaining = Math.ceil(SERVE_COUNTDOWN_SECONDS - elapsed / 1000)

    if (remaining <= 0) {
      this.serveTimerStart = null
      return {
        ...state,
        ball: launchBall(),
        status: 'playing',
        serveCountdown: null,
      }
    }

    return {
      ...state,
      serveCountdown: remaining,
    }
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.state)
    }
  }
}
