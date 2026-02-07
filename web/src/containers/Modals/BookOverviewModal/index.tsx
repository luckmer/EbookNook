import BookOverviewModal from '@pages/Modals/BookOverviewModal'
import { actions } from '@store/reducers/ui'
import { actions as bookActions } from '@store/reducers/books/index'
import { selectEpubMap } from '@store/selectors/books'
import { uiSelector } from '@store/selectors/ui'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const BookOverviewModalRoot = () => {
  const openSettingsModal = useSelector(uiSelector.openBookOverviewModal)
  const booksMap = useSelector(selectEpubMap)
  const dispatch = useDispatch()

  const book = useMemo(() => {
    return booksMap[openSettingsModal.bookId]
  }, [openSettingsModal.bookId, booksMap])

  return (
    <BookOverviewModal
      book={{
        bookDescription: book?.book?.metadata?.description,
        cover: book?.book.metadata?.cover,
        author: book?.book.author,
        title: book?.book.title,
        published: book?.book.metadata?.published,
        publisher: book?.book.metadata?.publisher,
      }}
      onClickClose={() => {
        dispatch(actions.setOpenBookOverviewModal({ status: false, bookId: '' }))
      }}
      onClickDelete={() => {
        dispatch(bookActions.deleteEpub(book?.book.id ?? ''))
        dispatch(actions.setOpenBookOverviewModal({ status: false, bookId: '' }))
      }}
      onClickEdit={() => {
        dispatch(bookActions.editEpub())
      }}
      isOpen={openSettingsModal.status}
    />
  )
}

export default BookOverviewModalRoot
