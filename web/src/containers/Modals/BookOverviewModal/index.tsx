import { BOOK_STATUS } from '@interfaces/book/enums'
import BookOverviewModal from '@pages/Modals/BookOverviewModal'
import { actions } from '@store/reducers/ui'
import { bookSelector } from '@store/selectors/books'
import { uiSelector } from '@store/selectors/ui'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const BookOverviewModalRoot = () => {
  const openSettingsModal = useSelector(uiSelector.openBookOverviewModal)
  const status = useSelector(bookSelector.statuses)
  const booksMap = useSelector(bookSelector.books)
  const dispatch = useDispatch()

  const book = useMemo(() => {
    return booksMap[openSettingsModal.bookId]
  }, [openSettingsModal.bookId, booksMap])

  useEffect(() => {
    if (!book) {
      dispatch(actions.setOpenBookOverviewModal({ status: false, bookId: '' }))
    }
  }, [book])

  const author = useMemo(() => {
    const author = book?.metadata?.author

    if (!author) {
      return '--'
    }

    if (typeof author === 'string') {
      return author
    }

    return typeof author.name === 'string' ? author.name : '----'
  }, [book])

  const title = useMemo(() => {
    const title = book?.metadata?.title

    console.log('title', title)
    if (!title) {
      return '--'
    }

    if (typeof title === 'string') {
      return title
    }

    return typeof title.name === 'string' ? title.name : '----'
  }, [book])

  return (
    <BookOverviewModal
      book={{
        bookDescription: book?.metadata?.description,
        cover: book?.metadata?.cover,
        author: author,
        title: title,
        published: book?.metadata?.published,
        publisher: book?.metadata?.publisher,
        status: status[openSettingsModal.bookId] ?? BOOK_STATUS.IDLE,
      }}
      onClickClose={() => {
        dispatch(actions.setOpenBookOverviewModal({ status: false, bookId: '' }))
      }}
      onClickDelete={() => {
        // const id = book?.book.id
        // if (!id) return
        // dispatch(bookActions.setDeleteEpub(id))
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
