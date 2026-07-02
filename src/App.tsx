import { useCallback, useState } from 'react'
import { GameCanvas } from './components/GameCanvas'
import { ScoreBoard } from './components/ScoreBoard'
import { StartScreen } from './components/StartScreen'
import { useGameInput } from './hooks/useGameInput'
import { useGameLoop } from './hooks/useGameLoop'
import { useGameShortcuts } from './hooks/useGameShortcuts'
import { usePause } from './hooks/usePause'

type AppPhase = 'menu' | 'playing'

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('menu')
  const getInputs = useGameInput()
  const { canvasRef, state, restart, togglePause, backToMenu } = useGameLoop(
    getInputs,
    phase === 'playing',
  )

  const handleBackToMenu = useCallback(() => {
    backToMenu()
    setPhase('menu')
  }, [backToMenu])

  const handlePlayAgain = useCallback(() => {
    restart()
  }, [restart])

  const isPlaying = phase === 'playing'
  const status = state?.status
  const isGameOver = status === 'gameover'
  const isPaused = status === 'paused'
  const showActions = isGameOver || isPaused

  usePause(
    isPlaying && (status === 'playing' || status === 'paused'),
    togglePause,
  )

  useGameShortcuts({
    enabled: isPlaying,
    status,
    onRestart: handlePlayAgain,
    onBackToMenu: handleBackToMenu,
  })

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative h-[600px] w-[800px]">
          <GameCanvas
            canvasRef={canvasRef}
            className={phase === 'menu' ? 'hidden' : ''}
          />
          {isPlaying && state && (
            <ScoreBoard
              leftScore={state.scores[0]}
              rightScore={state.scores[1]}
            />
          )}

          {phase === 'menu' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <StartScreen onStart={() => setPhase('playing')} />
            </div>
          )}
        </div>

        {showActions && (
          <div className="flex gap-3">
            {isGameOver && (
              <button
                type="button"
                onClick={handlePlayAgain}
                className="rounded-lg bg-white px-6 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200"
              >
                Play Again
              </button>
            )}
            <button
              type="button"
              onClick={handleBackToMenu}
              className="rounded-lg border border-neutral-700 px-6 py-2 text-sm font-medium transition hover:bg-neutral-900"
            >
              Back to Menu
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
