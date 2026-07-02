import { useEffect } from 'react'
import type { GameStatus } from '../game/types'

type GameShortcutsOptions = {
  enabled: boolean
  status: GameStatus | undefined
  onRestart: () => void
  onBackToMenu: () => void
}

export function useGameShortcuts({
  enabled,
  status,
  onRestart,
  onBackToMenu,
}: GameShortcutsOptions): void {
  useEffect(() => {
    if (!enabled) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'KeyR' && status === 'gameover') {
        event.preventDefault()
        onRestart()
      }
      if (
        event.code === 'KeyM' &&
        (status === 'gameover' || status === 'paused')
      ) {
        event.preventDefault()
        onBackToMenu()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enabled, status, onRestart, onBackToMenu])
}
