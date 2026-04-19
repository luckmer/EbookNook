import Home from '@pages/Home'
// import { actions as annotationActions } from '@store/reducers/annotations'
import { actions } from '@store/reducers/books'
import { actions as uiActions } from '@store/reducers/ui'
import { filteredBooks } from '@store/selectors/aggregated/books'
import { bookSelector } from '@store/selectors/books'
import { uiSelector } from '@store/selectors/ui'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const HomeRoot = () => {
  const dispatch = useDispatch()
  const availableBooks = useSelector(bookSelector.books)
  const isLoadingState = useSelector(uiSelector.isLoadingState)
  const isAddingBook = useSelector(uiSelector.isAddingBook)
  const books = useSelector(filteredBooks)

  const navigate = useNavigate()

  return (
    <Home
      books={books}
      isAddingBook={isAddingBook}
      isLoadingState={isLoadingState}
      hasBooks={Object.values(availableBooks).flat().length > 0}
      onClick={(file) => {
        dispatch(actions.importBook(file))
      }}
      onClickDetails={(bookId, format) => {
        dispatch(
          uiActions.setOpenBookOverviewModal({
            status: true,
            format,
            bookId,
          }),
        )
      }}
      onClickBook={(id, format) => {
        navigate('reader', { state: { id, format } })
        dispatch(actions.setOpenBook(id))
        dispatch(uiActions.setHideHeader(true))
      }}
    />
  )
}

export default HomeRoot
