type InstallHintProps = {
  onDismiss: () => void
}

export function InstallHint({ onDismiss }: InstallHintProps) {
  return (
    <div
      role="status"
      className="fixed inset-x-3 top-3 z-30 mx-auto max-w-md rounded-xl border border-neutral-700 bg-neutral-900/95 p-4 text-sm shadow-lg backdrop-blur-sm landscape:top-2 landscape:p-3 landscape:text-xs"
    >
      <p className="font-medium">Want the whole screen?</p>
      <p className="mt-1 text-neutral-400">
        Mobile browsers keep the address bar visible. Add Pong to your Home
        Screen, then open it from there for edge-to-edge play.
      </p>
      <p className="mt-2 text-neutral-500">
        Share menu → Add to Home Screen (or Install App on Android).
      </p>
      <button
        type="button"
        onClick={onDismiss}
        className="mt-3 rounded-lg border border-neutral-600 px-3 py-1.5 text-xs font-medium transition hover:bg-neutral-800"
      >
        Got it
      </button>
    </div>
  )
}
