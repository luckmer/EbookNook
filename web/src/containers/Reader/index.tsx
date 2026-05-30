import type { FormatType } from '@bindings/format'
import type { ProgressType } from '@bindings/progress'
import { LOADER_STATE, LOADER_STATUS } from '@interfaces/ui/enums'
import { getDocumentClient } from '@libs/document'
import { getPDFClient } from '@libs/pdf'
import Reader from '@pages/Reader'
import { actions as bookActions } from '@store/reducers/books'
import { type IReaderLocation, actions as readerActions } from '@store/reducers/reader'
import { actions } from '@store/reducers/ui'
import { bookmarksSelector } from '@store/selectors/bookmarks'
import { booksSelector } from '@store/selectors/books'
import { readerSelector } from '@store/selectors/reader'
import { settingsStyles } from '@store/selectors/settings'
import { uiSelector } from '@store/selectors/ui'
import { debounce } from '@utils/debounce'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const ReaderRoot = () => {
  const [isLoadingStructure, setIsLoadingStructure] = useState(true)
  const [isContentViewReady, setIsContentViewReady] = useState(false)
  const [isViewReady, setIsViewReady] = useState(false)
  const books = useSelector(booksSelector.books)
  const files = useSelector(booksSelector.files)
  const styles = useSelector(settingsStyles)
  const selectedChapter = useSelector(booksSelector.selectedChapter)
  const isLoader = useSelector(uiSelector.loaderState)
  const hideContent = useSelector(uiSelector.hideHeader)
  const readerLocation = useSelector(readerSelector.readerLocation)
  const selectedBookmark = useSelector(bookmarksSelector.selectedBookmark)

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

  useEffect(() => {
    if (!isContentViewReady) return

    const view = viewRef.current
    if (!view) return

    view.addEventListener('relocate', (e: { detail: IReaderLocation }) => {
      dispatch(readerActions.setReaderLocation(e.detail))
      saveProgress(e.detail, activeBook)
    })

    return () => {
      view.removeEventListener('relocate', (e: { detail: IReaderLocation }) => {
        dispatch(readerActions.setReaderLocation(e.detail))
        saveProgress(e.detail, activeBook)
      })
    }
  }, [isContentViewReady, dispatch, saveProgress, activeBook])

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

    if (viewRef.current && selectedBookmark.cfi !== null) {
      viewRef.current.init({ lastLocation: selectedBookmark.cfi })
      if (!selectedBookmark.hasChapter) {
        viewRef.current.goToFraction(0)
      }
    }
  }, [selectedBookmark, isLoadingStructure])

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
