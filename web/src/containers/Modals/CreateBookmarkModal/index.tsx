import { IBindingsBookmark } from '@bindings/bookmarks'
import { FormatType } from '@bindings/format'
import CreateBookmarkModal from '@pages/Modals/CreateBookmarkModal'
import { actions as bookmarkActions } from '@store/reducers/bookmarks'
import { actions } from '@store/reducers/ui'
import { booksSelector } from '@store/selectors/books'
import { readerSelector } from '@store/selectors/reader'
import { uiSelector } from '@store/selectors/ui'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
export interface ICache {
  id: string
  format: FormatType
}

const CreateBookmarkModalRoot = () => {
  const [cache, setCache] = useState<ICache | null>(null)
  const isOpen = useSelector(uiSelector.openCreateBookmarkModal)
  const readerLocation = useSelector(readerSelector.readerLocation)
  const books = useSelector(booksSelector.books)
  const location = useLocation()
  const dispatch = useDispatch()

  const bookState = useMemo(() => location?.state, [location])

  useEffect(() => {
    if (!bookState) return
    if (bookState.id !== cache?.id || bookState.format !== cache?.format) {
      setCache(bookState)
    }
  }, [bookState])

  const activeBook = useMemo(() => {
    if (!cache) return

    const bookShelf = books[cache.format]

    if (!bookShelf) return

    return bookShelf[cache.id]
  }, [cache, books])

  return (
    <CreateBookmarkModal
      onClickClose={() => {
        dispatch(actions.setOpenCreateBookmarkModal(false))
      }}
      isOpen={isOpen}
      onClickCreateBookmark={(title) => {
        if (!activeBook) {
          return
        }

        const data: IBindingsBookmark = {
          bookId: activeBook.id,
          cfi: readerLocation.cfi,
          chapter: readerLocation.tocItem.label,
          title: title.trim(),
          createdAt: Date.now().toString(),
          updatedAt: Date.now().toString(),
          format: activeBook.format,
        }

        dispatch(bookmarkActions.saveBookmark(data))
        dispatch(actions.setOpenCreateBookmarkModal(false))
      }}
    />
  )
}

export default CreateBookmarkModalRoot
