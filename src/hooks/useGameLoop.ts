import { useCallback, useEffect, useRef, useState } from 'react'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../game/constants'
import { GameEngine } from '../game/engine'
import { createInitialState } from '../game/physics'
import { render } from '../game/renderer'
import type { GameState, Inputs } from '../game/types'

export function useGameLoop(
  getInputs: () => Inputs,
  active: boolean,
): {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  containerRef: React.RefObject<HTMLDivElement | null>
  state: GameState | null
  restart: () => void
  togglePause: () => void
  backToMenu: () => void
} {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
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
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect()
      const scale = Math.min(
        rect.width / CANVAS_WIDTH,
        rect.height / CANVAS_HEIGHT,
      )
      const displayWidth = CANVAS_WIDTH * scale
      const displayHeight = CANVAS_HEIGHT * scale

      const dpr = window.devicePixelRatio || 1
      canvas.width = CANVAS_WIDTH * dpr
      canvas.height = CANVAS_HEIGHT * dpr
      canvas.style.width = `${displayWidth}px`
      canvas.style.height = `${displayHeight}px`

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      render(ctx, engineRef.current?.getState() ?? createInitialState())
    }

    const engine = new GameEngine()
    engine.setCanvasContext(ctx)
    engine.setInputProvider(getInputs)
    engineRef.current = engine

    const unsubscribe = engine.subscribe(setState)
    resizeCanvas()

    const observer = new ResizeObserver(resizeCanvas)
    observer.observe(container)

    return () => {
      observer.disconnect()
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

  return { canvasRef, containerRef, state, restart, togglePause, backToMenu }
}
