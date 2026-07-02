import { useCallback, useEffect, useRef, useState } from 'react'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../game/constants'
import { GameEngine } from '../game/engine'
import { render } from '../game/renderer'
import type { GameState, Inputs } from '../game/types'

export function useGameLoop(
  getInputs: () => Inputs,
  active: boolean,
): {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  state: GameState | null
  restart: () => void
  togglePause: () => void
  backToMenu: () => void
} {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<GameEngine | null>(null)
  const [state, setState] = useState<GameState | null>(null)

  const restart = useCallback(() => {
    engineRef.current?.start()
  }, [])

  const togglePause = useCallback(() => {
    engineRef.current?.togglePause()
  }, [])

  const backToMenu = useCallback(() => {
    engineRef.current?.reset()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = CANVAS_WIDTH * dpr
    canvas.height = CANVAS_HEIGHT * dpr
    canvas.style.width = `${CANVAS_WIDTH}px`
    canvas.style.height = `${CANVAS_HEIGHT}px`
    ctx.scale(dpr, dpr)

    const engine = new GameEngine()
    engine.setCanvasContext(ctx)
    engine.setInputProvider(getInputs)
    engineRef.current = engine

    const unsubscribe = engine.subscribe(setState)
    render(ctx, engine.getState())

    return () => {
      unsubscribe()
      engine.stop()
      engineRef.current = null
    }
  }, [getInputs])

  useEffect(() => {
    const engine = engineRef.current
    if (!engine) return

    if (active) {
      engine.start()
    } else {
      engine.reset()
    }
  }, [active])

  return { canvasRef, state, restart, togglePause, backToMenu }
}
