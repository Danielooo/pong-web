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
    event.currentTarget.setPointerCapture(event.pointerId)
    onPress(direction)
  }

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
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
      onPointerLeave={handlePointerUp}
      className="flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-full border-2 border-neutral-500/80 bg-neutral-900/90 text-4xl text-white shadow-xl backdrop-blur-sm transition active:scale-95 active:bg-neutral-700 disabled:opacity-40 landscape:h-20 landscape:w-20 landscape:text-[2.5rem] touch-none select-none"
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

  return (
    <div className="touch-controls flex w-[5.5rem] shrink-0 flex-col items-center justify-center landscape:w-[6.5rem]">
      <div className="flex flex-col gap-8 landscape:gap-10">
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
    </div>
  )
}
