type StartScreenProps = {
  onStart: () => void
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div>
        <h1 className="text-5xl font-bold tracking-tight">Pong</h1>
        <p className="mt-2 text-neutral-400">Local two-player — same keyboard</p>
      </div>

      <div className="grid grid-cols-2 gap-8 text-sm text-neutral-300">
        <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 px-6 py-4">
          <p className="mb-2 font-semibold text-white">Player 1 (left)</p>
          <p>
            <kbd className="rounded bg-neutral-800 px-2 py-1">W</kbd> up
          </p>
          <p className="mt-1">
            <kbd className="rounded bg-neutral-800 px-2 py-1">S</kbd> down
          </p>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 px-6 py-4">
          <p className="mb-2 font-semibold text-white">Player 2 (right)</p>
          <p>
            <kbd className="rounded bg-neutral-800 px-2 py-1">↑</kbd> up
          </p>
          <p className="mt-1">
            <kbd className="rounded bg-neutral-800 px-2 py-1">↓</kbd> down
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="rounded-lg bg-white px-8 py-3 font-semibold text-black transition hover:bg-neutral-200"
      >
        Play
      </button>
    </div>
  )
}
