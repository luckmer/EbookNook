import { BOOK_STATUS } from '@interfaces/book/enums'
import BookOverviewModal from '@pages/Modals/BookOverviewModal'
import { actions as bookActions } from '@store/reducers/books/index'
import { actions } from '@store/reducers/ui'
import { bookSelector, selectEpubMap } from '@store/selectors/books'
import { uiSelector } from '@store/selectors/ui'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const BookOverviewModalRoot = () => {
  const openSettingsModal = useSelector(uiSelector.openBookOverviewModal)
  const status = useSelector(bookSelector.statuses)
  const booksMap = useSelector(selectEpubMap)
  const dispatch = useDispatch()

  const book = useMemo(() => {
    return booksMap[openSettingsModal.bookId]
  }, [openSettingsModal.bookId, booksMap])

  useEffect(() => {
    if (!book) {
      dispatch(actions.setOpenBookOverviewModal({ status: false, bookId: '' }))
    }
  }, [book])

  return (
    <BookOverviewModal
      book={{
        bookDescription: book?.book?.metadata?.description,
        cover: book?.book.metadata?.cover,
        author: book?.book.author,
        title: book?.book.title,
        published: book?.book.metadata?.published,
        publisher: book?.book.metadata?.publisher,
        status: status[openSettingsModal.bookId] ?? BOOK_STATUS.IDLE,
      }}
      onClickClose={() => {
        dispatch(actions.setOpenBookOverviewModal({ status: false, bookId: '' }))
      }}
      onClickDelete={() => {
        const id = book?.book.id
        if (!id) return
        dispatch(bookActions.setDeleteEpub(id))
      }}
      onClickEdit={(content) => {
        const id = book?.book.id
        if (!id) return

        dispatch(bookActions.setEditEpub({ id, content }))
      }}
      isOpen={openSettingsModal.status}
    />
  )
}

export default BookOverviewModalRoot
