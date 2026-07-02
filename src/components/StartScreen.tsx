type StartScreenProps = {
  onStart: () => void
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center gap-6 text-center landscape:gap-4">
      <div>
        <h1 className="text-4xl font-bold tracking-tight landscape:text-3xl">
          Pong
        </h1>
        <p className="mt-2 text-sm text-neutral-400 landscape:text-xs">
          Local two-player — keyboard or touch
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 text-sm text-neutral-300 sm:grid-cols-2 sm:gap-6 landscape:gap-3">
        <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 px-5 py-4 landscape:px-4 landscape:py-3">
          <p className="mb-2 font-semibold text-white">Player 1 (left)</p>
          <p className="hidden sm:block">
            <kbd className="rounded bg-neutral-800 px-2 py-1">W</kbd> up ·{' '}
            <kbd className="rounded bg-neutral-800 px-2 py-1">S</kbd> down
          </p>
          <p className="sm:hidden">Use the left ↑ ↓ buttons</p>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 px-5 py-4 landscape:px-4 landscape:py-3">
          <p className="mb-2 font-semibold text-white">Player 2 (right)</p>
          <p className="hidden sm:block">
            <kbd className="rounded bg-neutral-800 px-2 py-1">↑</kbd> up ·{' '}
            <kbd className="rounded bg-neutral-800 px-2 py-1">↓</kbd> down
          </p>
          <p className="sm:hidden">Use the right ↑ ↓ buttons</p>
        </div>
      </div>

      <p className="max-w-sm text-xs text-neutral-500 landscape:hidden">
        Rotate your phone to landscape for the best experience.
      </p>

      <button
        type="button"
        onClick={onStart}
        className="rounded-lg bg-white px-8 py-3 font-semibold text-black transition hover:bg-neutral-200 landscape:px-6 landscape:py-2 landscape:text-sm"
      >
        Play
      </button>
    </div>
  )
}
