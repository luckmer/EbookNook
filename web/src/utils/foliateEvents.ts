import type { IReaderLocation } from '@store/reducers/reader'
import { useEffect } from 'react'

export interface IHandler {
  relocate: (e: { detail: IReaderLocation }) => void
  load: (event: Event) => void
}

export const getFoliateEvents = (view: any, isContentViewReady: boolean, handler: IHandler) => {
  useEffect(() => {
    if (!isContentViewReady) return
    if (!view) return

    view.addEventListener('relocate', handler.relocate)
    view.addEventListener('load', handler.load)

    return () => {
      view.removeEventListener('relocate', handler.relocate)
      view.removeEventListener('load', handler?.load)
    }
  }, [view, isContentViewReady, handler])
}
