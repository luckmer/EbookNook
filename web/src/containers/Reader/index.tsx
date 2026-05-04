import { FormatType } from '@bindings/format'
import { ProgressType } from '@bindings/progress'
import { getDocumentClient } from '@libs/document'
import { getPDFClient } from '@libs/pdf'
import Reader from '@pages/Reader'
import { actions as bookActions } from '@store/reducers/books'
import { actions } from '@store/reducers/ui'
import { bookSelector } from '@store/selectors/books'
import { settingsStyles } from '@store/selectors/settings'
import { uiSelector } from '@store/selectors/ui'
import { debounce } from '@utils/debounce'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const ReaderRoot = () => {
  const [isLoadingStructure, setIsLoadingStructure] = useState(true)
  const [sectionProgress, setSectionProgress] = useState({ current: 0, total: 0 })
  const [bookProgress, setBookProgress] = useState({ current: 0, next: 0, total: 0 })
  const [fraction, setFraction] = useState(0)
  const [isViewReady, setIsViewReady] = useState(false)
  const [isContentViewReady, setIsContentViewReady] = useState(false)

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

  const handleHideHeader = useCallback(() => {
    dispatch(actions.setHideHeader(true))
  }, [dispatch])

  const handleShowHeader = useCallback(() => {
    dispatch(actions.setHideHeader(false))
  }, [dispatch])

  const handleRelocate = (e: any) => {
    if (!activeBook) return

    const progress: Partial<Record<ProgressType, string>> = {
      CFI: e.detail.cfi,
    }

    setSectionProgress(e.detail.section)
    setBookProgress(e.detail.location)
    setFraction(e.detail.fraction)

    dispatch(bookActions.setActiveToc(e.detail.tocItem))
    dispatch(
      bookActions.updateBookProgress({
        percentageProgress: String(e.detail.fraction * 100),
        format: activeBook.format,
        id: activeBook.id,
        progress,
      }),
    )
  }

  useEffect(() => {
    if (!file) {
      if (viewRef.current) {
        viewRef.current.close()
        viewRef.current.remove()
      }
      setIsViewReady(false)
      viewRef.current = null
      setIsLoadingStructure(true)
      setSectionProgress({ current: 0, total: 0 })
      setBookProgress({ current: 0, next: 0, total: 0 })
      setIsContentViewReady(false)
      setFraction(0)
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

  useEffect(() => {
    if (!isContentViewReady) return

    const view = viewRef.current
    if (!view) return

    view.addEventListener('relocate', debounce(handleRelocate, 100))

    return () => {
      view.removeEventListener('relocate', handleRelocate)
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
        current: Math.max(1, sectionProgress.current),
        total: sectionProgress.total,
      }}
      pageInfo={{
        percentage: fraction * 100,
        current: Math.max(1, bookProgress.current),
        total: bookProgress.total,
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
