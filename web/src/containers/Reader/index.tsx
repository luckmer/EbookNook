import Reader from '@pages/Reader'
import { actions as bookActions } from '@store/reducers/books'
import { actions } from '@store/reducers/ui'
import { bookSelector } from '@store/selectors/books'
import { uiSelector } from '@store/selectors/ui'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const ReaderRoot = () => {
  const [isLoadingStructure, setIsLoadingStructure] = useState(true)
  const [sectionProgress, setSectionProgress] = useState({ current: 0, total: 0 })
  const [bookProgress, setBookProgress] = useState({ current: 0, next: 0, total: 0 })
  const [fraction, setFraction] = useState(0)

  const files = useSelector(bookSelector.files)
  const selectedChapter = useSelector(bookSelector.selectedChapter)
  const isLoader = useSelector(uiSelector.isFetchingStructure)
  const hideContent = useSelector(uiSelector.hideHeader)
  const location = useLocation()

  const bookId = useMemo(() => location?.state?.id, [location])
  const file = useMemo(() => files[bookId], [bookId, files])

  const dispatch = useDispatch()
  const viewRef = useRef<any | null>(null)
  const isViewCreated = useRef(false)

  useEffect(() => {
    if (!file) {
      viewRef?.current?.close()
      viewRef?.current?.remove()
      isViewCreated.current = false
      viewRef.current = null
      setIsLoadingStructure(true)
      return
    }

    if (isViewCreated.current) return
    isViewCreated.current = true

    const openBook = async () => {
      await import('@foliate/view.js')
      const container = document.querySelector('.book-content')
      if (!container) return
      const view = document.createElement('foliate-view') as any
      view.id = `foliate-view-${Date.now()}`
      view.style.width = '100%'
      view.style.height = '100vh'
      container.appendChild(view)

      console.log('book', file)
      await view.open(file)
      viewRef.current = view
      view.renderer.setStyles?.(`
        * {
          color: white !important;
          background: transparent !important;
        }
      `)
      await view.goToFraction(0)
      setIsLoadingStructure(false)
    }

    openBook().catch(console.error)
  }, [file, bookId])

  useEffect(() => {
    if (viewRef.current && selectedChapter !== '') {
      viewRef.current.goTo(selectedChapter)
    }
  }, [selectedChapter])

  useEffect(() => {
    if (isLoadingStructure || isLoader || !viewRef.current) return

    const view = viewRef.current

    const handleRelocate = (e: any) => {
      dispatch(bookActions.setActiveToc(e.detail.tocItem))
      setSectionProgress(e.detail.section)
      setBookProgress(e.detail.location)
      setFraction(e.detail.fraction)
    }

    view.addEventListener('relocate', handleRelocate)

    return () => {
      view.removeEventListener('relocate', handleRelocate)
    }
  }, [isLoadingStructure, isLoader])

  const handleHideHeader = useCallback(() => {
    dispatch(actions.setHideHeader(true))
  }, [dispatch])

  const handleShowHeader = useCallback(() => {
    dispatch(actions.setHideHeader(false))
  }, [dispatch])

  return (
    <Reader
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
