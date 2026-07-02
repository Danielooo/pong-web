import { useCallback, useState } from 'react'
import { GameCanvas } from './components/GameCanvas'
import { GameControls } from './components/GameControls'
import { MobileControls } from './components/MobileControls'
import { ScoreBoard } from './components/ScoreBoard'
import { StartScreen } from './components/StartScreen'
import { useGameInput } from './hooks/useGameInput'
import { useGameLoop } from './hooks/useGameLoop'
import { useGameShortcuts } from './hooks/useGameShortcuts'
import { usePause } from './hooks/usePause'

type AppPhase = 'menu' | 'playing'

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('menu')
  const { getInputs, setTouchInput } = useGameInput()
  const { canvasRef, containerRef, state, restart, togglePause, backToMenu } =
    useGameLoop(getInputs, phase === 'playing')

  const handleBackToMenu = useCallback(() => {
    backToMenu()
    setPhase('menu')
  }, [backToMenu])

  const handlePlayAgain = useCallback(() => {
    restart()
  }, [restart])

  const isPlaying = phase === 'playing'
  const status = state?.status
  const controlsDisabled =
    status === 'paused' ||
    status === 'gameover' ||
    status === 'idle' ||
    status === undefined

  usePause(
    isPlaying &&
      (status === 'playing' || status === 'paused' || status === 'serving'),
    togglePause,
  )

  useGameShortcuts({
    enabled: isPlaying,
    status,
    onRestart: handlePlayAgain,
    onBackToMenu: handleBackToMenu,
  })

  return (
    <>
      <div className="portrait-warning fixed inset-0 z-50 hidden items-center justify-center bg-black p-8 text-center md:hidden">
        <div>
          <p className="text-2xl font-bold">Rotate your device</p>
          <p className="mt-3 text-neutral-400">
            This game works best in landscape mode on mobile.
          </p>
        </div>
      </div>

      <main className="game-shell flex min-h-[100dvh] flex-col items-center justify-center gap-3 p-3 landscape:gap-2 landscape:p-2">
        <div className="flex w-full max-w-[900px] flex-col items-center gap-3 landscape:max-w-none landscape:gap-2">
          <div
            ref={containerRef}
            className="game-board relative aspect-[4/3] w-full max-h-[min(600px,calc(100dvh-7rem))] max-w-[800px] landscape:max-h-[calc(100dvh-5rem)] landscape:max-w-[min(900px,calc(100vw-1rem))]"
          >
            <GameCanvas
              canvasRef={canvasRef}
              className={phase === 'menu' ? 'hidden' : ''}
            />
            {isPlaying && state && (
              <>
                <ScoreBoard
                  leftScore={state.scores[0]}
                  rightScore={state.scores[1]}
                />
                <MobileControls
                  onTouchInput={setTouchInput}
                  disabled={controlsDisabled}
                />
              </>
            )}

            {phase === 'menu' && (
              <div className="absolute inset-0 flex items-center justify-center overflow-y-auto px-2">
                <StartScreen onStart={() => setPhase('playing')} />
              </div>
            )}
          </div>

          {isPlaying && (
            <GameControls
              status={status}
              onPause={togglePause}
              onResume={togglePause}
              onRestart={handlePlayAgain}
              onBackToMenu={handleBackToMenu}
            />
          )}
        </div>
      </main>
    </>
  )
}
