type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null
  mozFullScreenElement?: Element | null
  msFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void> | void
  mozCancelFullScreen?: () => Promise<void> | void
  msExitFullscreen?: () => Promise<void> | void
}

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void
  mozRequestFullScreen?: () => Promise<void> | void
  msRequestFullscreen?: () => Promise<void> | void
}

export type FullscreenMode = 'native' | 'fallback' | 'none'

const FULLSCREEN_CHANGE_EVENTS = [
  'fullscreenchange',
  'webkitfullscreenchange',
  'mozfullscreenchange',
  'MSFullscreenChange',
] as const

export function getFullscreenElement(): Element | null {
  const doc = document as FullscreenDocument
  return (
    doc.fullscreenElement ??
    doc.webkitFullscreenElement ??
    doc.mozFullScreenElement ??
    doc.msFullscreenElement ??
    null
  )
}

export function isNativeFullscreenActive(): boolean {
  return getFullscreenElement() !== null
}

export function isNativeFullscreenSupported(): boolean {
  const element = document.documentElement as FullscreenElement
  return (
    typeof element.requestFullscreen === 'function' ||
    typeof element.webkitRequestFullscreen === 'function' ||
    typeof element.mozRequestFullScreen === 'function' ||
    typeof element.msRequestFullscreen === 'function'
  )
}

export async function requestNativeFullscreen(
  element: HTMLElement,
): Promise<boolean> {
  const target = element as FullscreenElement

  try {
    if (typeof target.requestFullscreen === 'function') {
      await target.requestFullscreen()
      return true
    }
    if (typeof target.webkitRequestFullscreen === 'function') {
      await target.webkitRequestFullscreen()
      return true
    }
    if (typeof target.mozRequestFullScreen === 'function') {
      await target.mozRequestFullScreen()
      return true
    }
    if (typeof target.msRequestFullscreen === 'function') {
      await target.msRequestFullscreen()
      return true
    }
  } catch {
    return false
  }

  return false
}

export async function exitNativeFullscreen(): Promise<void> {
  const doc = document as FullscreenDocument

  if (typeof doc.exitFullscreen === 'function') {
    await doc.exitFullscreen()
    return
  }
  if (typeof doc.webkitExitFullscreen === 'function') {
    await doc.webkitExitFullscreen()
    return
  }
  if (typeof doc.mozCancelFullScreen === 'function') {
    await doc.mozCancelFullScreen()
    return
  }
  if (typeof doc.msExitFullscreen === 'function') {
    await doc.msExitFullscreen()
  }
}

export function subscribeToNativeFullscreenChange(
  listener: () => void,
): () => void {
  for (const eventName of FULLSCREEN_CHANGE_EVENTS) {
    document.addEventListener(eventName, listener)
  }

  return () => {
    for (const eventName of FULLSCREEN_CHANGE_EVENTS) {
      document.removeEventListener(eventName, listener)
    }
  }
}
