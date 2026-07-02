import type { PointerEvent } from 'react'
import type { PlayerInput } from '../game/types'

type MobileControlsProps = {
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
      className="flex h-14 w-14 items-center justify-center rounded-full border border-neutral-600/80 bg-neutral-900/80 text-2xl text-white shadow-lg backdrop-blur-sm transition active:scale-95 active:bg-neutral-700 disabled:opacity-40 landscape:h-12 landscape:w-12 landscape:text-xl touch-none select-none"
    >
      {direction === 'up' ? '↑' : '↓'}
    </button>
  )
}

type PlayerPadProps = {
  player: 1 | 2
  onTouchInput: (player: 1 | 2, input: PlayerInput) => void
  disabled?: boolean
}

function PlayerPad({ player, onTouchInput, disabled }: PlayerPadProps) {
  const handlePress = (input: PlayerInput) => {
    onTouchInput(player, input)
  }

  return (
    <div className="flex flex-col gap-3 landscape:gap-2">
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

export function MobileControls({ onTouchInput, disabled }: MobileControlsProps) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-3 landscape:px-2">
      <div className="pointer-events-auto">
        <PlayerPad player={1} onTouchInput={onTouchInput} disabled={disabled} />
      </div>
      <div className="pointer-events-auto">
        <PlayerPad player={2} onTouchInput={onTouchInput} disabled={disabled} />
      </div>
    </div>
  )
}
