import { BOOK_STATUS } from '@interfaces/book/enums'
import BookOverviewModal from '@pages/Modals/BookOverviewModal'
import { actions as bookActions } from '@store/reducers/books'
import { actions } from '@store/reducers/ui'
import { bookSelector } from '@store/selectors/books'
import { uiSelector } from '@store/selectors/ui'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const BookOverviewModalRoot = () => {
  const openSettingsModal = useSelector(uiSelector.openBookOverviewModal)
  const status = useSelector(bookSelector.statuses)
  const booksMap = useSelector(bookSelector.books)
  const dispatch = useDispatch()

  const book = useMemo(() => {
    const bookShelf = booksMap[openSettingsModal.format]

    if (!bookShelf) return

    return bookShelf[openSettingsModal.bookId]
  }, [openSettingsModal.bookId, booksMap])

  const [cachedBook, setCachedBook] = useState(book)

  useEffect(() => {
    if (openSettingsModal.status && book) {
      setCachedBook(book)
    }
  }, [openSettingsModal.status, book])

  useEffect(() => {
    if (!book) {
      dispatch(actions.setOpenBookOverviewModal({ status: false, bookId: '', format: 'EPUB' }))
    }
  }, [book])

  return (
    <BookOverviewModal
      book={{
        bookDescription: cachedBook?.metadata?.description,
        cover: cachedBook?.metadata?.cover,
        author: cachedBook?.metadata.author,
        title: cachedBook?.metadata.title,
        published: cachedBook?.metadata?.published,
        publisher: cachedBook?.metadata?.publisher,
        status: status[openSettingsModal.bookId] ?? BOOK_STATUS.IDLE,
      }}
      onClickClose={() => {
        dispatch(actions.setOpenBookOverviewModal({ status: false, bookId: '', format: 'EPUB' }))
      }}
      onClickDelete={() => {
        if (!book) return
        dispatch(bookActions.setDeleteBook({ id: book.id, format: book.format }))
      }}
      onClickEdit={() => {
        // const id = book?.book.id
        // if (!id) return
        // dispatch(bookActions.setEditEpub({ id, content }))
      }}
      isOpen={openSettingsModal.status}
    />
  )
}

export default BookOverviewModalRoot
