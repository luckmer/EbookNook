import type { FormatType } from '@bindings/format'
import ReaderContentDrawer from '@pages/Drawers/ReaderContentDrawer'
import { actions as bookmarkActions } from '@store/reducers/bookmarks'
import { actions as bookActions } from '@store/reducers/books'
import { actions as noteActions } from '@store/reducers/notes'
import { actions as uiActions } from '@store/reducers/ui'
import { bookmarksSelector } from '@store/selectors/bookmarks'
import { booksSelector } from '@store/selectors/books'
import { notesSelector } from '@store/selectors/notes'
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
  const loaderState = useSelector(uiSelector.loaderState)
  const scopedLoader = useSelector(uiSelector.scopedLoaderState)
  const books = useSelector(booksSelector.books)
  const activeToc = useSelector(booksSelector.activeToc)
  const bookmarksState = useSelector(bookmarksSelector.bookmarks)
  const notesState = useSelector(notesSelector.notes)

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

    return bookmarksState[cache.id] ?? []
  }, [bookmarksState, cache])

  const notes = useMemo(() => {
    if (!cache) return []

    const shelf = notesState[cache.id]
    if (!shelf) return []

    return Object.values(shelf).filter(Boolean).flat()
  }, [notesState, cache])

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
    }
  }, [activeBook])

  return (
    <ReaderContentDrawer
      activeToc={activeToc}
      book={book}
      bookmarks={activeBookmarks}
      toc={activeBook?.toc ?? []}
      loaderState={loaderState}
      scopedLoader={scopedLoader}
      isOpen={isOpen}
      notes={notes}
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
            hasChapter: bookmark.chapter !== '----',
            cfi: bookmark.cfi,
          }),
        )
      }}
      onClick={(href) => {
        dispatch(bookActions.setSelectedChapter(href))
        dispatch(uiActions.setHideHeader(true))
      }}
      onClickEdit={(bookmark) => {
        dispatch(bookmarkActions.updateBookmark(bookmark))
      }}
      onClickDelete={(id, cfi) => {
        dispatch(
          bookmarkActions.deleteBookmark({
            id,
            cfi,
          }),
        )
      }}
      onClickNote={(note) => {
        dispatch(uiActions.setOpenChaptersDrawer(false))
        dispatch(uiActions.setHideHeader(true))
        dispatch(
          noteActions.setSelectedNote({
            cfi: note.value,
            selectedAt: Date.now().toString(),
          }),
        )
      }}
      onClickEditNote={(note) => {
        dispatch(noteActions.updateNote(note))
      }}
      onClickDeleteNote={(id, noteId, page) => {
        dispatch(noteActions.deleteNote({ id, noteId, page }))
      }}
    />
  )
}

export default BookContentDrawerRoot
