import type { RefObject } from 'react'

type GameCanvasProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>
  className?: string
}

export function GameCanvas({ canvasRef, className = '' }: GameCanvasProps) {
  return (
    <canvas
      ref={canvasRef}
      className={`block rounded-lg border border-neutral-800 shadow-2xl ${className}`}
      aria-label="Pong game board"
    />
  )
}
