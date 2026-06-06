import type { IBindingsMetadata } from '@bindings/metadata'
import BookOverviewModal from '@pages/Modals/BookOverviewModal'
import { actions as bookActions } from '@store/reducers/books'
import { actions } from '@store/reducers/ui'
import { booksSelector } from '@store/selectors/books'
import { uiSelector } from '@store/selectors/ui'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const BookOverviewModalRoot = () => {
  const openSettingsModal = useSelector(uiSelector.openBookOverviewModal)
  const status = useSelector(uiSelector.scopedLoaderState)
  const booksMap = useSelector(booksSelector.books)
  const dispatch = useDispatch()

  const book = useMemo(() => {
    const book = booksMap[openSettingsModal.bookId]

    if (!book) return

    return book
  }, [booksMap, openSettingsModal])

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
  }, [book, dispatch])

  const pendingStatus = useMemo(() => {
    const bookStatus = status[openSettingsModal.bookId]
    return bookStatus
  }, [status, openSettingsModal?.bookId])

  return (
    <BookOverviewModal
      book={{
        bookDescription: cachedBook?.metadata?.description,
        cover: cachedBook?.metadata?.cover,
        author: cachedBook?.metadata.author,
        title: cachedBook?.metadata.title,
        published: cachedBook?.metadata?.published,
        publisher: cachedBook?.metadata?.publisher,
        status: pendingStatus,
      }}
      onClickClose={() => {
        dispatch(actions.setOpenBookOverviewModal({ status: false, bookId: '', format: 'EPUB' }))
      }}
      onClickDelete={() => {
        if (!book) return
        dispatch(bookActions.setDeleteBook({ id: book.id, format: book.format }))
      }}
      onClickEdit={(metadata) => {
        if (!book) return
        const id = book?.id

        if (!id) return

        const content: IBindingsMetadata = {
          ...book.metadata,
          author: metadata.author ?? book.metadata.author,
          description: metadata.description ?? book.metadata.description,
          title: metadata.title ?? book.metadata.title,
          publisher: metadata.publisher ?? book.metadata.publisher,
          published: metadata.published ?? book.metadata.published,
        }

        dispatch(bookActions.updateBookMetadata(content))
      }}
      isOpen={openSettingsModal.status}
    />
  )
}

export default BookOverviewModalRoot
