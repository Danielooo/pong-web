type NavigatorWithStandalone = Navigator & {
  standalone?: boolean
}

export function isStandaloneDisplayMode(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    (window.navigator as NavigatorWithStandalone).standalone === true
  )
}

export function isMobileDevice(): boolean {
  return (
    window.matchMedia('(pointer: coarse)').matches &&
    window.matchMedia('(max-width: 768px)').matches
  )
}

export function canHideBrowserChrome(): boolean {
  return isStandaloneDisplayMode() || !isMobileDevice()
}
