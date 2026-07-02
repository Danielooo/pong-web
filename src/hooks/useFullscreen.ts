import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import type { FullscreenMode } from '../utils/fullscreen'
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
  toggleFullscreen: () => Promise<void>
}

export function useFullscreen(
  targetRef: RefObject<HTMLElement | null>,
): UseFullscreenResult {
  const [mode, setMode] = useState<FullscreenMode>('none')
  const modeRef = useRef<FullscreenMode>('none')

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
      const entered = await requestNativeFullscreen(target)
      if (entered) {
        modeRef.current = 'native'
        setMode('native')
        return
      }
    }

    modeRef.current = 'fallback'
    setMode('fallback')
  }, [targetRef])

  const exitFullscreen = useCallback(async () => {
    if (modeRef.current === 'native') {
      await exitNativeFullscreen()
    }

    modeRef.current = 'none'
    setMode('none')
  }, [])

  const toggleFullscreen = useCallback(async () => {
    if (modeRef.current === 'none') {
      await enterFullscreen()
      return
    }

    await exitFullscreen()
  }, [enterFullscreen, exitFullscreen])

  return {
    isFullscreen: mode !== 'none',
    mode,
    canUseNativeFullscreen: isNativeFullscreenSupported(),
    toggleFullscreen,
  }
}
