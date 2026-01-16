import { Epub } from '@libs/epub/epub'
import Reader from '@pages/Reader'
import { actions as BookActions } from '@store/reducers/books'
import { actions } from '@store/reducers/ui'
import { bookSelector, selectEpubMap } from '@store/selectors/books'
import { settingsConfig } from '@store/selectors/settings'
import { uiSelector } from '@store/selectors/ui'
import { debounce } from '@utils/debounce'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const ReaderRoot = () => {
  const [pageInfo, setPageInfo] = useState({ current: 1, total: 1, path: '' })
  const [bookId, setBookId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const isFetchingStructure = useSelector(uiSelector.isFetchingStructure)
  const selectedChapter = useSelector(bookSelector.selectedChapter)
  const hideContent = useSelector(uiSelector.hideHeader)
  const settings = useSelector(settingsConfig)
  const booksMap = useSelector(selectEpubMap)

  const dispatch = useDispatch()
  const location = useLocation()

  const renderedBookIdRef = useRef<string | null>(null)
  const viewRef = useRef<Epub | null>(null)

  const hash = useMemo(() => location?.state?.id, [location])
  const book = useMemo(() => booksMap[hash], [hash, booksMap])

  const handleHideHeader = useCallback(() => {
    dispatch(actions.setHideHeader(true))
  }, [dispatch])

  const handleShowHeader = useCallback(() => {
    dispatch(actions.setHideHeader(false))
  }, [dispatch])

  const bookRef = useRef(book)

  useEffect(() => {
    bookRef.current = book
  }, [book])

  const debouncedUpdate = useMemo(
    () =>
      debounce((info: typeof pageInfo) => {
        const currentBook = bookRef.current
        if (!currentBook) return

        const [savedPath, savedPage] = currentBook.book.progress
        if (info.path !== savedPath || info.current.toString() !== savedPage) {
          dispatch(
            BookActions.setUpdateEpubBookProgress({
              progress: [info.path, info.current.toString()],
              id: currentBook.book.id,
            })
          )
        }
      }, 500),
    [dispatch]
  )

  useEffect(() => {
    if (book && !isFetchingStructure && renderedBookIdRef.current !== book.book.id) {
      if (viewRef.current) viewRef.current.destroy()

      const instance = new Epub(book)
      instance.renderTo('.book-content')
      instance.progress((current, total, path) => {
        setPageInfo({ current, total, path })
      })

      viewRef.current = instance
      renderedBookIdRef.current = book.book.id
    }

    return () => {
      if (!location.state?.id) {
        viewRef.current?.destroy()
        viewRef.current = null
        renderedBookIdRef.current = null
      }
    }
  }, [book?.book.id, isFetchingStructure, location.state?.id])

  useEffect(() => {
    if (viewRef.current && !isFetchingStructure) {
      setLoading(true)
      if (selectedChapter) {
        viewRef.current.display(selectedChapter).then(() => {
          setLoading(false)
        })
      } else if (book?.book.progress?.every((p) => p.length > 0)) {
        viewRef.current.loadProgress(book.book.progress).then(() => {
          setLoading(false)
        })
      } else {
        viewRef.current.display().then(() => {
          setLoading(false)
        })
      }
      setLoading(false)
    }
  }, [selectedChapter, isFetchingStructure, book?.book.id])

  useEffect(() => {
    viewRef.current?.setStyles(settings)
  }, [settings])

  useEffect(() => {
    if (pageInfo.path) debouncedUpdate(pageInfo)
    return () => debouncedUpdate.clear()
  }, [pageInfo, debouncedUpdate])

  useEffect(() => {
    if (bookId !== book?.book.id) {
      setBookId(book?.book.id ?? null)
      setLoading(true)
    }
  }, [book, setBookId])

  return (
    <Reader
      pageInfo={pageInfo}
      loading={loading || !book}
      hideContent={hideContent}
      onHideHeader={handleHideHeader}
      onShowHeader={handleShowHeader}
      onClickNextChapter={() => viewRef.current?.nextChapter()}
      onClickPrevChapter={() => viewRef.current?.prevChapter()}
      onClickPrevPage={() => viewRef.current?.prevPage()}
      onClickNextPage={() => viewRef.current?.nextPage()}
    />
  )
}

export default ReaderRoot
