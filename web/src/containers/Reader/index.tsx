import { IProgressInfo } from '@interfaces/index'
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
  const [bookId, setBookId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [pageInfo, setPageInfo] = useState<IProgressInfo>({
    current: 1,
    total: 1,
    path: '',
    percent: 0,
    offset: 0,
  })

  const isFetchingStructure = useSelector(uiSelector.isFetchingStructure)
  const selectedChapter = useSelector(bookSelector.selectedChapter)
  const hideContent = useSelector(uiSelector.hideHeader)
  const settings = useSelector(settingsConfig)
  const booksMap = useSelector(selectEpubMap)

  const dispatch = useDispatch()
  const location = useLocation()

  const renderedBookIdRef = useRef<string | null>(null)
  const viewRef = useRef<Epub | null>(null)

  const id = useMemo(() => location?.state?.id, [location])
  const book = useMemo(() => booksMap[id], [id, booksMap])

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

        const [savedPath, savedOffset] = currentBook.book.progress
        if (info.path !== savedPath || +info.offset !== +savedOffset) {
          dispatch(
            BookActions.setUpdateEpubBookProgress({
              progress: [info.path, info.offset.toString(), info.percent.toString()],
              id: currentBook.book.id,
            }),
          )
        }
      }, 500),
    [dispatch],
  )

  useEffect(() => {
    if (book && !isFetchingStructure && renderedBookIdRef.current !== book.book.id) {
      if (viewRef.current) viewRef.current.destroy()

      const instance = new Epub(book)
      instance.renderTo('.book-content')
      instance.progress((progress) => {
        setPageInfo(progress)
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
      viewRef.current.setStyles(settings)
      setLoading(true)

      const promise = new Promise<Document>(async (resolve, reject) => {
        const view = viewRef.current

        if (!view) {
          reject('')
          return
        }

        if (selectedChapter) {
          await view.display(selectedChapter)
          resolve(view.frame.document)
          return
        }

        if (book?.book.progress.slice(0, 2)?.every((p) => p.length > 0)) {
          await view.loadProgress(book.book.progress)
          resolve(view.frame.document)
          return
        }

        await view.display()
        resolve(view.frame.document)
      })

      promise.finally(() => setLoading(false))
    }
  }, [selectedChapter, isFetchingStructure, book?.book.id])

  useEffect(() => {
    if (!loading) {
      viewRef.current?.setStyles(settings)
    }
  }, [settings, loading])

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
      pageInfo={{
        percentage: pageInfo.percent,
        current: pageInfo.current,
        total: pageInfo.total,
      }}
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
