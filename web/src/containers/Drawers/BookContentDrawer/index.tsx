import { FormatType } from '@bindings/format'
import { BOOK_STATUS } from '@interfaces/book/enums'
import ReaderContentDrawer from '@pages/Drawers/ReaderContentDrawer'
import { actions as bookActions } from '@store/reducers/books'
import { actions as uiActions } from '@store/reducers/ui'
import { bookSelector } from '@store/selectors/books'
import { uiSelector } from '@store/selectors/ui'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

export interface ICache {
  id: string
  format: FormatType
}

const BookContentDrawerRoot = () => {
  const [cache, setCache] = useState<ICache | null>(null)
  const isOpen = useSelector(uiSelector.openChaptersDrawer)
  const isLoader = useSelector(uiSelector.isFetchingStructure)
  const books = useSelector(bookSelector.books)
  const activeToc = useSelector(bookSelector.activeToc)
  const status = useSelector(bookSelector.statuses)

  const navigate = useNavigate()

  const location = useLocation()
  const dispatch = useDispatch()

  const bookState = useMemo(() => location?.state, [location])
  const activeBook = useMemo(() => {
    if (!cache) return

    const bookShelf = books[cache.format]

    if (!bookShelf) return

    return bookShelf[cache.id]
  }, [cache, books])

  useEffect(() => {
    if (!bookState) return
    if (bookState.id !== cache?.id || bookState.format !== cache?.format) {
      setCache(bookState)
    }
  }, [bookState])

  const book = useMemo(() => {
    return {
      author: activeBook?.metadata?.author ?? '--',
      title: activeBook?.metadata?.title ?? '--',
      cover: activeBook?.metadata?.cover,
      published: activeBook?.metadata?.published,
      publisher: activeBook?.metadata?.publisher,
      description: activeBook?.metadata?.description,
      status: status[cache?.id ?? ''] ?? BOOK_STATUS.IDLE,
    }
  }, [activeBook])

  return (
    <ReaderContentDrawer
      activeToc={activeToc}
      book={book}
      toc={activeBook?.toc ?? []}
      isLoader={isLoader}
      isOpen={isOpen}
      onClickBack={() => {
        dispatch(uiActions.setOpenChaptersDrawer(false))
        dispatch(bookActions.setSelectedChapter(''))
        navigate('/')
      }}
      onClickClose={() => {
        dispatch(uiActions.setHideHeader(true))
        dispatch(uiActions.setOpenChaptersDrawer(false))
      }}
      onClick={(href) => {
        dispatch(bookActions.setSelectedChapter(href))
      }}
    />
  )
}

export default BookContentDrawerRoot
