import { useCallback, useRef, useState } from 'react'
import { FullscreenButton } from './components/FullscreenButton'
import { GameCanvas } from './components/GameCanvas'
import { GameControls } from './components/GameControls'
import { InstallHint } from './components/InstallHint'
import { MobilePlayerControls } from './components/MobileControls'
import { ScoreBoard } from './components/ScoreBoard'
import { StartScreen } from './components/StartScreen'
import { useFullscreen } from './hooks/useFullscreen'
import { useGameInput } from './hooks/useGameInput'
import { useGameLoop } from './hooks/useGameLoop'
import { useGameShortcuts } from './hooks/useGameShortcuts'
import { usePause } from './hooks/usePause'
import { useVisualViewport } from './hooks/useVisualViewport'
import { isStandaloneDisplayMode } from './utils/displayMode'

type AppPhase = 'menu' | 'playing'

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('menu')
  const fullscreenTargetRef = useRef<HTMLElement>(null)
  useVisualViewport()
  const { getInputs, setTouchInput } = useGameInput()
  const { canvasRef, containerRef, state, restart, togglePause, backToMenu } =
    useGameLoop(getInputs, phase === 'playing')
  const {
    isFullscreen,
    mode,
    showInstallHint,
    dismissInstallHint,
    toggleFullscreen,
  } = useFullscreen(fullscreenTargetRef)
  const isStandalone = isStandaloneDisplayMode()

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

      <main
        ref={fullscreenTargetRef}
        className={`game-shell relative flex min-h-[100dvh] flex-col items-center justify-center gap-3 py-3 select-none landscape:gap-2 landscape:py-2 ${
          mode === 'fallback' ? 'is-fallback-fullscreen' : ''
        } ${isStandalone ? 'is-standalone' : ''}`}
      >
        {showInstallHint && (
          <InstallHint onDismiss={dismissInstallHint} />
        )}

        {!isStandalone && (
          <div className="fullscreen-button-wrap absolute top-0 right-0 z-20">
            <FullscreenButton
              isFullscreen={isFullscreen}
              onToggle={() => {
                void toggleFullscreen()
              }}
            />
          </div>
        )}

        <div className="game-layout flex w-full max-w-[100vw] items-stretch justify-center">
          {isPlaying && (
            <MobilePlayerControls
              player={1}
              onTouchInput={setTouchInput}
              disabled={controlsDisabled}
            />
          )}

          <div
            ref={containerRef}
            className={
              isPlaying
                ? 'relative flex min-h-0 flex-1 items-center justify-center self-stretch max-h-[calc(var(--visual-viewport-height,100dvh)-5.5rem)]'
                : 'relative flex aspect-[4/3] w-full max-w-[min(800px,calc(100vw-2rem))] items-center justify-center'
            }
          >
            <div className="relative inline-flex items-center justify-center">
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
            </div>

            {phase === 'menu' && (
              <div className="absolute inset-0 flex items-center justify-center overflow-y-auto px-2">
                <StartScreen onStart={() => setPhase('playing')} />
              </div>
            )}
          </div>

          {isPlaying && (
            <MobilePlayerControls
              player={2}
              onTouchInput={setTouchInput}
              disabled={controlsDisabled}
            />
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
      </main>
    </>
  )
}
