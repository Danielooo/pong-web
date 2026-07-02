import type { PointerEvent } from 'react'
import type { PlayerInput } from '../game/types'

type MobilePlayerControlsProps = {
  player: 1 | 2
  onTouchInput: (player: 1 | 2, input: PlayerInput) => void
  disabled?: boolean
}

type ArrowButtonProps = {
  label: string
  direction: 'up' | 'down'
  onPress: (input: PlayerInput) => void
  disabled?: boolean
}

function ArrowButton({ label, direction, onPress, disabled }: ArrowButtonProps) {
  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    onPress(direction)
  }

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    onPress('none')
  }

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onContextMenu={(event) => event.preventDefault()}
      className="mobile-paddle-button flex min-h-[7rem] w-full flex-1 items-center justify-center rounded-[2rem] border-2 border-neutral-500/80 bg-neutral-900/95 text-[3.25rem] leading-none text-white shadow-xl transition active:bg-neutral-700 disabled:opacity-40 landscape:min-h-[7.5rem] landscape:rounded-[2.25rem] landscape:text-[3.5rem]"
    >
      {direction === 'up' ? '↑' : '↓'}
    </button>
  )
}

export function MobilePlayerControls({
  player,
  onTouchInput,
  disabled,
}: MobilePlayerControlsProps) {
  const handlePress = (input: PlayerInput) => {
    onTouchInput(player, input)
  }

  const blockTouch = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  return (
    <div
      className="touch-controls flex w-[8rem] shrink-0 flex-col self-stretch gap-5 py-1 landscape:w-[8.5rem] landscape:gap-6 landscape:py-2"
      onContextMenu={blockTouch}
    >
      <ArrowButton
        label={`Player ${player} move up`}
        direction="up"
        onPress={handlePress}
        disabled={disabled}
      />
      <ArrowButton
        label={`Player ${player} move down`}
        direction="down"
        onPress={handlePress}
        disabled={disabled}
      />
    </div>
  )
}
