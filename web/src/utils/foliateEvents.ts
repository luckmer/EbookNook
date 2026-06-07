import type { IReaderLocation } from '@store/reducers/reader'
import { useEffect } from 'react'

export interface IHandler {
  relocate: (e: { detail: IReaderLocation }) => void
  drawAnnotation: (e: Event) => void
  load: (event: Event) => void
}

export const getFoliateEvents = (view: any, isContentViewReady: boolean, handler: IHandler) => {
  useEffect(() => {
    if (!isContentViewReady) return
    if (!view) return

    view.addEventListener('relocate', handler.relocate)
    view.addEventListener('load', handler.load)
    view.addEventListener('draw-annotation', handler.drawAnnotation)

    return () => {
      view.removeEventListener('relocate', handler.relocate)
      view.removeEventListener('load', handler?.load)
      view.removeEventListener('draw-annotation', handler.drawAnnotation)
    }
  }, [view, isContentViewReady, handler])
}
