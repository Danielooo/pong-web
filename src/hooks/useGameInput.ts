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

export type GameInputControls = {
  getInputs: () => Inputs
  setTouchInput: (player: 1 | 2, input: PlayerInput) => void
}

export function useGameInput(): GameInputControls {
  const inputsRef = useRef<Inputs>({
    player1: 'none',
    player2: 'none',
  })
  const heldRef = useRef(new Set<string>())
  const touchRef = useRef<Pick<Inputs, 'player1' | 'player2'>>({
    player1: 'none',
    player2: 'none',
  })

  const syncInputs = useCallback(() => {
    inputsRef.current = {
      player1: mergeInput(
        resolveInput(heldRef.current, PLAYER1_KEYS),
        touchRef.current.player1,
      ),
      player2: mergeInput(
        resolveInput(heldRef.current, PLAYER2_KEYS),
        touchRef.current.player2,
      ),
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code in PLAYER1_KEYS || event.code in PLAYER2_KEYS) {
        event.preventDefault()
        heldRef.current.add(event.code)
        syncInputs()
      }
    }

    const onKeyUp = (event: KeyboardEvent) => {
      heldRef.current.delete(event.code)
      syncInputs()
    }

    const onBlur = () => {
      heldRef.current.clear()
      syncInputs()
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [syncInputs])

  const getInputs = useCallback(() => inputsRef.current, [])

  const setTouchInput = useCallback(
    (player: 1 | 2, input: PlayerInput) => {
      const key = player === 1 ? 'player1' : 'player2'
      touchRef.current[key] = input
      syncInputs()
    },
    [syncInputs],
  )

  return { getInputs, setTouchInput }
}

function mergeInput(
  keyboard: PlayerInput,
  touch: PlayerInput,
): PlayerInput {
  if (keyboard !== 'none') return keyboard
  return touch
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
