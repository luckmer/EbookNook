import { FormatType } from '@bindings/format'
import { ProgressType } from '@bindings/progress'
import { getDocumentClient } from '@libs/document'
import { getEventEmitter } from '@libs/eventEmitter'
import { getPDFClient } from '@libs/pdf'
import Reader from '@pages/Reader'
import { actions as bookmarkActions } from '@store/reducers/bookmarks'
import { actions as bookActions } from '@store/reducers/books'
import { actions } from '@store/reducers/ui'
import { bookSelector } from '@store/selectors/books'
import { settingsStyles } from '@store/selectors/settings'
import { uiSelector } from '@store/selectors/ui'
import { debounce } from '@utils/debounce'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

export interface ILocation {
  cfi: string
  fraction: number
  location: {
    current: number
    next: number
    total: number
  }
  time: {
    current: number
    total: number
  }
  tocItem: {
    href: string
    label: string
    id: number
    subitems: Array<{
      id: number
      href: string
      label: string
    }>
  }
}

const defaultReaderLocation = {
  cfi: '',
  fraction: 0,
  location: {
    current: 0,
    next: 0,
    total: 0,
  },
  time: {
    current: 0,
    total: 0,
  },
  tocItem: {
    href: '',
    label: '',
    id: 0,
    subitems: [],
  },
}

const ReaderRoot = () => {
  const [isLoadingStructure, setIsLoadingStructure] = useState(true)
  const [readerLocation, setReaderLocation] = useState<ILocation>(defaultReaderLocation)
  const [isContentViewReady, setIsContentViewReady] = useState(false)
  const [isViewReady, setIsViewReady] = useState(false)

  const books = useSelector(bookSelector.books)
  const files = useSelector(bookSelector.files)
  const styles = useSelector(settingsStyles)
  const selectedChapter = useSelector(bookSelector.selectedChapter)
  const isLoader = useSelector(uiSelector.isFetchingStructure)
  const hideContent = useSelector(uiSelector.hideHeader)
  const location = useLocation()

  const bookState: { id: string; format: FormatType } = useMemo(() => {
    return {
      id: location?.state?.id || '',
      format: location?.state?.format || '',
    }
  }, [location])
  const file = useMemo(() => files[bookState.id], [bookState, files])

  const dispatch = useDispatch()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const viewRef = useRef<any | null>(null)

  const activeBook = useMemo(() => {
    const bookShelf = books[bookState.format]

    if (!bookShelf) return

    return bookShelf[bookState.id]
  }, [bookState, books])

  const eventEmitter = getEventEmitter()

  const handleHideHeader = useCallback(() => {
    dispatch(actions.setHideHeader(true))
  }, [dispatch])

  const handleShowHeader = useCallback(() => {
    dispatch(actions.setHideHeader(false))
  }, [dispatch])

  useEffect(() => {
    if (!file) {
      if (viewRef.current) {
        viewRef.current.close()
        viewRef.current.remove()
      }
      setIsViewReady(false)
      viewRef.current = null
      setIsLoadingStructure(true)
      setReaderLocation(defaultReaderLocation)

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
  }, [file, activeBook])

  const saveProgress = useMemo(
    () =>
      debounce((location: ILocation, book: typeof activeBook) => {
        if (!book) return

        const progress: Partial<Record<ProgressType, string>> = {
          CFI: location.cfi,
        }

        dispatch(bookActions.setActiveToc(location.tocItem))
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

  useEffect(() => {
    if (!activeBook || !isContentViewReady) return

    const handler = () => {
      if (JSON.stringify(defaultReaderLocation) === JSON.stringify(readerLocation)) return

      dispatch(
        bookmarkActions.saveBookmark({
          label: readerLocation.tocItem.label,
          date: Date.now().toString(),
          format: activeBook.format,
          cfi: readerLocation.cfi,
          id: activeBook.id,
        }),
      )
    }

    eventEmitter.on('save_bookmark', handler)

    return () => {
      eventEmitter.off('save_bookmark', handler)
    }
  }, [readerLocation, activeBook, isContentViewReady])

  useEffect(() => {
    if (
      !activeBook ||
      !isContentViewReady ||
      JSON.stringify(defaultReaderLocation) === JSON.stringify(readerLocation)
    ) {
      return
    }

    saveProgress(readerLocation, activeBook)
  }, [readerLocation, activeBook, isContentViewReady])

  useEffect(() => {
    if (!isContentViewReady) return

    const view = viewRef.current
    if (!view) return

    view.addEventListener('relocate', (e: { detail: ILocation }) => setReaderLocation(e.detail))

    return () => {
      view.removeEventListener('relocate', (e: { detail: ILocation }) =>
        setReaderLocation(e.detail),
      )
    }
  }, [isContentViewReady])

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

  return (
    <Reader
      containerRef={containerRef}
      sectionInfo={{
        current: Math.max(1, readerLocation.location.current),
        total: readerLocation.location.total,
      }}
      pageInfo={{
        percentage: readerLocation.fraction * 100,
        current: Math.max(1, readerLocation.location.current),
        total: readerLocation.location.total,
      }}
      loading={isLoadingStructure || isLoader}
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
