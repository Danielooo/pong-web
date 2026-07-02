import { useCallback, useEffect, useRef } from 'react'
import type { HorizontalInput, Inputs, PlayerInput, VerticalInput } from '../game/types'

const NO_INPUT: PlayerInput = { vertical: 'none', horizontal: 'none' }

const PLAYER1_VERTICAL_KEYS: Record<string, VerticalInput> = {
  KeyW: 'up',
  KeyS: 'down',
}

const PLAYER1_HORIZONTAL_KEYS: Record<string, HorizontalInput> = {
  KeyA: 'left',
  KeyD: 'right',
}

const PLAYER2_VERTICAL_KEYS: Record<string, VerticalInput> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
}

const PLAYER2_HORIZONTAL_KEYS: Record<string, HorizontalInput> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
}

const ALL_GAME_KEYS = new Set([
  ...Object.keys(PLAYER1_VERTICAL_KEYS),
  ...Object.keys(PLAYER1_HORIZONTAL_KEYS),
  ...Object.keys(PLAYER2_VERTICAL_KEYS),
  ...Object.keys(PLAYER2_HORIZONTAL_KEYS),
])

export function useGameInput(): () => Inputs {
  const inputsRef = useRef<Inputs>({
    player1: NO_INPUT,
    player2: NO_INPUT,
  })

  useEffect(() => {
    const held = new Set<string>()

    const updateInputs = () => {
      inputsRef.current = {
        player1: resolvePlayerInput(held, PLAYER1_VERTICAL_KEYS, PLAYER1_HORIZONTAL_KEYS),
        player2: resolvePlayerInput(held, PLAYER2_VERTICAL_KEYS, PLAYER2_HORIZONTAL_KEYS),
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (ALL_GAME_KEYS.has(event.code)) {
        event.preventDefault()
        held.add(event.code)
        updateInputs()
      }
    }

    const onKeyUp = (event: KeyboardEvent) => {
      held.delete(event.code)
      updateInputs()
    }

    const onBlur = () => {
      held.clear()
      updateInputs()
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [])

  return useCallback(() => inputsRef.current, [])
}

function resolvePlayerInput(
  held: Set<string>,
  verticalKeys: Record<string, VerticalInput>,
  horizontalKeys: Record<string, HorizontalInput>,
): PlayerInput {
  return {
    vertical: resolveAxisInput(held, verticalKeys),
    horizontal: resolveAxisInput(held, horizontalKeys),
  }
}

function resolveAxisInput<T extends string>(
  held: Set<string>,
  keyMap: Record<string, T>,
): T | 'none' {
  for (const [code, input] of Object.entries(keyMap)) {
    if (held.has(code)) return input
  }
  return 'none'
}
