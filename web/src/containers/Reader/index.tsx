import { Epub } from '@libs/epub/epub'
import Reader from '@pages/Reader'
import { actions } from '@store/reducers/ui'
import { bookSelector, selectEpubMap } from '@store/selectors/books'
import { settingsConfig } from '@store/selectors/settings'
import { uiSelector } from '@store/selectors/ui'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const ReaderRoot = () => {
  const [pageInfo, setPageInfo] = useState({ current: 1, total: 1 })
  const [loading, setLoading] = useState(true)

  const isFetchingStructure = useSelector(uiSelector.isFetchingStructure)
  const selectedChapter = useSelector(bookSelector.selectedChapter)
  const hideContent = useSelector(uiSelector.hideHeader)
  const settings = useSelector(settingsConfig)
  const booksMap = useSelector(selectEpubMap)

  const dispatch = useDispatch()
  const location = useLocation()

  const hash = useMemo(() => location?.state?.id, [location])
  const book = useMemo(() => booksMap[hash], [hash, booksMap])

  const viewRef = useRef<Epub | null>(null)

  useEffect(() => {
    if (typeof book !== 'undefined' && !isFetchingStructure) {
      const book_epub = new Epub(book)

      book_epub.renderTo('.book-content')
      setLoading(false)
      viewRef.current = book_epub
    }
  }, [selectedChapter, book, isFetchingStructure])

  useEffect(() => {
    if (typeof book !== 'undefined' && !isFetchingStructure) {
      viewRef.current?.display(selectedChapter)
      viewRef.current?.progress((current, total) => {
        setPageInfo({ current, total })
      })
    }
  }, [book, selectedChapter, isFetchingStructure])

  useEffect(() => {
    viewRef?.current?.setStyles(settings)
  }, [settings, selectedChapter])

  return (
    <Reader
      pageInfo={pageInfo}
      loading={loading}
      hideContent={hideContent}
      onHideHeader={() => {
        dispatch(actions.setHideHeader(true))
      }}
      onShowHeader={() => {
        dispatch(actions.setHideHeader(false))
      }}
      onClickNextChapter={() => {
        viewRef.current?.nextChapter()
      }}
      onClickPrevChapter={() => {
        viewRef.current?.prevChapter()
      }}
      onClickPrevPage={() => {
        viewRef.current?.prevPage()
      }}
      onClickNextPage={() => {
        viewRef.current?.nextPage()
      }}
    />
  )
}

export default ReaderRoot
