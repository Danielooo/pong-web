import { useCallback, useEffect, useRef } from 'react'
import type { Inputs, PlayerInput } from '../game/types'

const PLAYER1_KEYS: Record<string, PlayerInput> = {
  KeyW: 'up',
  KeyS: 'down',
}

const PLAYER2_KEYS: Record<string, PlayerInput> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
}

export function useGameInput(): () => Inputs {
  const inputsRef = useRef<Inputs>({
    player1: 'none',
    player2: 'none',
  })

  useEffect(() => {
    const held = new Set<string>()

    const updateInputs = () => {
      inputsRef.current = {
        player1: resolveInput(held, PLAYER1_KEYS),
        player2: resolveInput(held, PLAYER2_KEYS),
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code in PLAYER1_KEYS || event.code in PLAYER2_KEYS) {
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

function resolveInput(
  held: Set<string>,
  keyMap: Record<string, PlayerInput>,
): PlayerInput {
  for (const [code, input] of Object.entries(keyMap)) {
    if (held.has(code)) return input
  }
  return 'none'
}
