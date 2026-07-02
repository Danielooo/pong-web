import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import type { FullscreenMode } from '../utils/fullscreen'
import {
  canHideBrowserChrome,
  isStandaloneDisplayMode,
} from '../utils/displayMode'
import {
  exitNativeFullscreen,
  isNativeFullscreenActive,
  isNativeFullscreenSupported,
  requestNativeFullscreen,
  subscribeToNativeFullscreenChange,
} from '../utils/fullscreen'

type UseFullscreenResult = {
  isFullscreen: boolean
  mode: FullscreenMode
  canUseNativeFullscreen: boolean
  showInstallHint: boolean
  dismissInstallHint: () => void
  toggleFullscreen: () => Promise<void>
}

export function useFullscreen(
  targetRef: RefObject<HTMLElement | null>,
): UseFullscreenResult {
  const [mode, setMode] = useState<FullscreenMode>(() =>
    isStandaloneDisplayMode() ? 'fallback' : 'none',
  )
  const [showInstallHint, setShowInstallHint] = useState(false)
  const modeRef = useRef<FullscreenMode>(
    isStandaloneDisplayMode() ? 'fallback' : 'none',
  )

  const syncNativeState = useCallback(() => {
    if (modeRef.current !== 'fallback' && isNativeFullscreenActive()) {
      modeRef.current = 'native'
      setMode('native')
      return
    }

    if (modeRef.current === 'native' && !isNativeFullscreenActive()) {
      modeRef.current = 'none'
      setMode('none')
    }
  }, [])

  useEffect(() => {
    return subscribeToNativeFullscreenChange(syncNativeState)
  }, [syncNativeState])

  useEffect(() => {
    if (mode !== 'fallback') return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        modeRef.current = 'none'
        setMode('none')
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mode])

  const enterFullscreen = useCallback(async () => {
    const target = targetRef.current
    if (!target) return

    if (isNativeFullscreenSupported()) {
      const entered =
        (await requestNativeFullscreen(document.documentElement)) ||
        (await requestNativeFullscreen(target))
      if (entered) {
        modeRef.current = 'native'
        setMode('native')
        if (!canHideBrowserChrome()) {
          setShowInstallHint(true)
        }
        return
      }
    }

    modeRef.current = 'fallback'
    setMode('fallback')
    if (!canHideBrowserChrome()) {
      setShowInstallHint(true)
    }
  }, [targetRef])

  const exitFullscreen = useCallback(async () => {
    if (modeRef.current === 'native') {
      await exitNativeFullscreen()
    }

    if (!isStandaloneDisplayMode()) {
      modeRef.current = 'none'
      setMode('none')
    }
  }, [])

  const toggleFullscreen = useCallback(async () => {
    if (isStandaloneDisplayMode()) return

    if (modeRef.current === 'none') {
      await enterFullscreen()
      return
    }

    await exitFullscreen()
  }, [enterFullscreen, exitFullscreen])

  const dismissInstallHint = useCallback(() => {
    setShowInstallHint(false)
  }, [])

  const isFullscreen =
    mode !== 'none' || isStandaloneDisplayMode()

  return {
    isFullscreen,
    mode: isStandaloneDisplayMode() ? 'fallback' : mode,
    canUseNativeFullscreen: isNativeFullscreenSupported(),
    showInstallHint,
    dismissInstallHint,
    toggleFullscreen,
  }
}
