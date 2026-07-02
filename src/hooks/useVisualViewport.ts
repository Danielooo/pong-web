import { useEffect } from 'react'

function updateVisualViewportVars(): void {
  const viewport = window.visualViewport
  const height = viewport?.height ?? window.innerHeight
  const width = viewport?.width ?? window.innerWidth
  const offsetTop = viewport?.offsetTop ?? 0
  const offsetLeft = viewport?.offsetLeft ?? 0

  document.documentElement.style.setProperty(
    '--visual-viewport-height',
    `${height}px`,
  )
  document.documentElement.style.setProperty(
    '--visual-viewport-width',
    `${width}px`,
  )
  document.documentElement.style.setProperty(
    '--visual-viewport-offset-top',
    `${offsetTop}px`,
  )
  document.documentElement.style.setProperty(
    '--visual-viewport-offset-left',
    `${offsetLeft}px`,
  )
}

export function useVisualViewport(): void {
  useEffect(() => {
    updateVisualViewportVars()

    const viewport = window.visualViewport
    viewport?.addEventListener('resize', updateVisualViewportVars)
    viewport?.addEventListener('scroll', updateVisualViewportVars)
    window.addEventListener('resize', updateVisualViewportVars)
    window.addEventListener('orientationchange', updateVisualViewportVars)

    return () => {
      viewport?.removeEventListener('resize', updateVisualViewportVars)
      viewport?.removeEventListener('scroll', updateVisualViewportVars)
      window.removeEventListener('resize', updateVisualViewportVars)
      window.removeEventListener('orientationchange', updateVisualViewportVars)
    }
  }, [])
}
