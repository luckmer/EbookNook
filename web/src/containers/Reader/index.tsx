import type { FormatType } from '@bindings/format'
import type { IBindingsNote } from '@bindings/notes'
import type { ProgressType } from '@bindings/progress'
import { Overlayer } from '@foliate/overlayer.js'
import { NAVIGATION } from '@interfaces/routes/enums'
import { LOADER_STATE, LOADER_STATUS } from '@interfaces/ui/enums'
import { getDocumentClient } from '@libs/document'
import { getEventEmitter } from '@libs/eventEmitter'
import { getPDFClient } from '@libs/pdf'
import Reader from '@pages/Reader'
import { actions as bookActions } from '@store/reducers/books'
import { type IReaderLocation, actions as readerActions } from '@store/reducers/reader'
import { actions } from '@store/reducers/ui'
import { getSelectedAnnotation } from '@store/selectors/aggregated/annotations'
import { booksSelector } from '@store/selectors/books'
import { notesSelector } from '@store/selectors/notes'
import { readerSelector } from '@store/selectors/reader'
import { settingsStyles } from '@store/selectors/settings'
import { uiSelector } from '@store/selectors/ui'
import { debounce } from '@utils/debounce'
import { getFoliateDocEvents } from '@utils/docEvents'
import { getFoliateEvents } from '@utils/foliateEvents'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const ReaderRoot = () => {
  const [notesCache, setNotesCache] = useState<IBindingsNote[]>([])
  const [isLoadingStructure, setIsLoadingStructure] = useState(true)
  const [isContentViewReady, setIsContentViewReady] = useState(false)
  const [isViewReady, setIsViewReady] = useState(false)
  const [currentPageIndex, setCurrentPageIndex] = useState(-1)

  const books = useSelector(booksSelector.books)
  const files = useSelector(booksSelector.files)
  const styles = useSelector(settingsStyles)
  const selectedChapter = useSelector(booksSelector.selectedChapter)
  const isLoader = useSelector(uiSelector.loaderState)
  const hideContent = useSelector(uiSelector.hideHeader)
  const readerLocation = useSelector(readerSelector.readerLocation)
  const selectedAnnotation = useSelector(getSelectedAnnotation)
  const notesState = useSelector(notesSelector.notes)

  const location = useLocation()
  const emitter = getEventEmitter()
  const dispatch = useDispatch()

  const containerRef = useRef<HTMLDivElement | null>(null)
  const viewRef = useRef<any | null>(null)

  const bookState: { id: string; format: FormatType } = useMemo(
    () => ({
      id: location?.state?.id || '',
      format: location?.state?.format || '',
    }),
    [location],
  )

  const file = useMemo(() => files[bookState.id], [bookState, files])

  const activeBook = useMemo(() => {
    const bookShelf = books[bookState.format]
    if (!bookShelf) return
    return bookShelf[bookState.id]
  }, [bookState, books])

  const notes = useMemo(() => {
    if (!activeBook || currentPageIndex === -1) return []

    const notesList = notesState[activeBook.id]
    if (!notesList) return []

    return notesList[currentPageIndex] ?? []
  }, [notesState, currentPageIndex, activeBook])

  const handleHideHeader = useCallback(() => {
    dispatch(actions.setHideHeader(true))
  }, [dispatch])

  const handleShowHeader = useCallback(() => {
    dispatch(actions.setHideHeader(false))
  }, [dispatch])

  const saveProgress = useMemo(
    () =>
      debounce((location: IReaderLocation, book: typeof activeBook) => {
        if (!book) return

        const progress: Partial<Record<ProgressType, string>> = {
          CFI: location.cfi,
        }

        if (location.tocItem) {
          dispatch(bookActions.setActiveToc(location.tocItem))
        }

        dispatch(
          bookActions.updateBookProgress({
            percentageProgress: String(location.fraction * 100),
            format: book.format,
            id: book.id,
            progress,
          }),
        )
      }, 300),
    [dispatch],
  )

  const relocate = (e: { detail: IReaderLocation }) => {
    dispatch(readerActions.setReaderLocation(e.detail))
    saveProgress(e.detail, activeBook)
  }

  const load = (e: any) => {
    const doc = e.detail.doc
    const index = e.detail.index
    if (!doc) return

    const view = viewRef.current
    setCurrentPageIndex(index + 1)

    getFoliateDocEvents(doc, {
      mouseUp: () => {
        const selection = doc.getSelection()
        const range = selection.getRangeAt(0)
        const cfi = view.getCFI(index, range)
        if (!cfi) return

        const note: IBindingsNote = {
          bookId: '',
          chapter: '',
          title: '',
          note: '',
          noteId: '',
          createdAt: '',
          color: '',
          updatedAt: '',
          value: cfi,
          page: Number(index + 1).toString(),
          text: selection.toString(),
        }

        emitter.dispatch('annotationClick', {
          iframe: doc.defaultView?.frameElement,
          selected: selection,
          note,
          doc,
        })
      },
      mouseDown: () => emitter.dispatch('restartAnnotator'),
      resize: () => emitter.dispatch('restartAnnotator'),
    })
  }

  const drawAnnotation = (e: any) => {
    const { draw, annotation } = e.detail
    draw(Overlayer.highlight, { color: annotation.color ?? '#4DA3FF' })
  }

  getFoliateEvents(viewRef.current, isContentViewReady, { relocate, load, drawAnnotation })

  useEffect(() => {
    if (!file) {
      if (viewRef.current) {
        viewRef.current.close()
        viewRef.current.remove()
      }
      setIsViewReady(false)
      viewRef.current = null
      setIsLoadingStructure(true)
      setIsContentViewReady(false)
      return
    }

    if (isViewReady) return
    setIsViewReady(true)

    const openBook = async () => {
      await import('@foliate/view.js')

      const container = containerRef.current
      if (!container) return

      const view = document.createElement('foliate-view') as any
      view.id = `foliate-view-${Date.now()}`
      view.style.width = '100%'
      view.style.height = '100vh'
      container.appendChild(view)

      viewRef.current = view
      setIsContentViewReady(true)

      const client = getDocumentClient()
      const isPDF = await client.isPDF(file)

      if (isPDF) {
        const pdfClient = getPDFClient()
        const content = await pdfClient.init(file)
        await view.open(content)
      } else {
        await view.open(file)
      }

      const lastLocation = activeBook?.progress?.CFI
      if (lastLocation) {
        await view.init({ lastLocation })
      } else {
        await view.goToFraction(0)
      }

      setIsLoadingStructure(false)
    }

    if (activeBook) {
      openBook().catch(console.error)
    }
  }, [file, activeBook, isViewReady])

  useEffect(() => {
    if (viewRef.current && selectedChapter !== '') {
      viewRef.current.goTo(selectedChapter)
    }
  }, [selectedChapter])

  useEffect(() => {
    if (isLoadingStructure) return
    const view = viewRef.current
    if (!view) return
    view.renderer.setStyles?.(styles)
  }, [styles, isLoadingStructure])

  useEffect(() => {
    if (isLoadingStructure) return
    if (viewRef.current && selectedAnnotation.cfi !== null) {
      viewRef.current.init({ lastLocation: selectedAnnotation.cfi })
    }
  }, [selectedAnnotation, isLoadingStructure])

  useEffect(() => {
    const view = viewRef.current
    if (!view || isLoadingStructure) {
      return
    }

    const cachedCFI = new Set(notesCache.map((n) => n.value))
    const currentCFI = new Set(notes.map((n) => n.value))

    notesCache.forEach((note) => {
      if (!currentCFI.has(note.value)) {
        view.deleteAnnotation({ value: note.value })
      }
    })

    notes.forEach((note) => {
      if (!cachedCFI.has(note.value)) {
        view.addAnnotation({ value: note.value, color: note.color })
      }
    })

    setNotesCache(notes)
  }, [isLoadingStructure, notes, notesCache])

  useEffect(() => {
    if (location.pathname !== NAVIGATION.READER) {
      emitter.dispatch('restartAnnotator')
    }
  }, [location, emitter])

  return (
    <Reader
      containerRef={containerRef}
      sectionInfo={{
        current: Math.max(1, readerLocation.location.current),
        total: readerLocation.location.total,
      }}
      pageInfo={{
        current: Math.max(1, readerLocation.location.current),
        percentage: readerLocation.fraction * 100,
        total: readerLocation.location.total,
      }}
      loading={
        isLoadingStructure ||
        isLoader[LOADER_STATE.IS_FETCHING_STRUCTURE]?.status === LOADER_STATUS.LOADING
      }
      hideContent={hideContent}
      onHideHeader={handleHideHeader}
      onShowHeader={handleShowHeader}
      onClickNextChapter={() => {}}
      onClickPrevChapter={() => {}}
      onClickPrevPage={() => {
        if (viewRef.current) viewRef.current.prev()
      }}
      onClickNextPage={() => {
        if (viewRef.current) viewRef.current.next()
      }}
    />
  )
}

export default ReaderRoot
