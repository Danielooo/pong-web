type FullscreenButtonProps = {
  isFullscreen: boolean
  onToggle: () => void
}

export function FullscreenButton({
  isFullscreen,
  onToggle,
}: FullscreenButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isFullscreen}
      aria-label={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
      className="rounded-lg border border-neutral-700 bg-neutral-900/80 px-3 py-2 text-sm font-medium backdrop-blur-sm transition hover:bg-neutral-800 landscape:px-2.5 landscape:py-1.5 landscape:text-xs"
    >
      {isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
    </button>
  )
}
