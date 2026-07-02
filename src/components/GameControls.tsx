type GameControlsProps = {
  status: 'idle' | 'playing' | 'paused' | 'serving' | 'gameover' | undefined
  onPause: () => void
  onResume: () => void
  onRestart: () => void
  onBackToMenu: () => void
}

export function GameControls({
  status,
  onPause,
  onResume,
  onRestart,
  onBackToMenu,
}: GameControlsProps) {
  const canPause = status === 'playing' || status === 'serving'
  const isPaused = status === 'paused'
  const isGameOver = status === 'gameover'
  const showInGameControls = canPause || isPaused

  if (!showInGameControls && !isGameOver) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {canPause && (
        <button
          type="button"
          onClick={onPause}
          className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium transition hover:bg-neutral-900 landscape:px-3 landscape:py-1.5 landscape:text-xs"
        >
          Pause
        </button>
      )}
      {isPaused && (
        <>
          <button
            type="button"
            onClick={onResume}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200 landscape:px-3 landscape:py-1.5 landscape:text-xs"
          >
            Resume
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium transition hover:bg-neutral-900 landscape:px-3 landscape:py-1.5 landscape:text-xs"
          >
            Restart
          </button>
        </>
      )}
      {isGameOver && (
        <button
          type="button"
          onClick={onRestart}
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200 landscape:px-3 landscape:py-1.5 landscape:text-xs"
        >
          Play Again
        </button>
      )}
      {(isPaused || isGameOver) && (
        <button
          type="button"
          onClick={onBackToMenu}
          className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium transition hover:bg-neutral-900 landscape:px-3 landscape:py-1.5 landscape:text-xs"
        >
          Back to Menu
        </button>
      )}
    </div>
  )
}
