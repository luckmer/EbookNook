import type { FormatType } from '@bindings/format'
import { BOOK_STATUS } from '@interfaces/book/enums'
import ReaderContentDrawer from '@pages/Drawers/ReaderContentDrawer'
import { actions as bookmarkActions } from '@store/reducers/bookmarks'
import { actions as bookActions } from '@store/reducers/books'
import { actions as uiActions } from '@store/reducers/ui'
import { bookmarksSelector } from '@store/selectors/bookmarks'
import { booksSelector } from '@store/selectors/books'
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
  const books = useSelector(booksSelector.books)
  const activeToc = useSelector(booksSelector.activeToc)
  const status = useSelector(booksSelector.statuses)
  const bookmarksState = useSelector(bookmarksSelector.bookmarks)

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

  const activeBookmarks = useMemo(() => {
    if (!cache) return []

    return bookmarksState[cache.id]
  }, [bookmarksState, cache])

  useEffect(() => {
    if (!bookState) return
    if (bookState.id !== cache?.id || bookState.format !== cache?.format) {
      setCache(bookState)
    }
  }, [bookState, cache])

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
  }, [activeBook, cache, status])

  return (
    <ReaderContentDrawer
      activeToc={activeToc}
      book={book}
      bookmarks={activeBookmarks}
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
      onClickBookmark={(bookmark) => {
        dispatch(uiActions.setOpenChaptersDrawer(false))
        dispatch(uiActions.setHideHeader(true))
        dispatch(
          bookmarkActions.setSelectedBookmark({
            selectedAt: Date.now().toString(),
            cfi: bookmark.cfi,
          }),
        )
      }}
      onClick={(href) => {
        dispatch(bookActions.setSelectedChapter(href))
        dispatch(uiActions.setHideHeader(true))
      }}
    />
  )
}

export default BookContentDrawerRoot
