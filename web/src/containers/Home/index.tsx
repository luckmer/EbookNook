import { LOADER_STATE, LOADER_STATUS } from '@interfaces/ui/enums'
import Home from '@pages/Home'
import { actions } from '@store/reducers/books'
import { actions as uiActions } from '@store/reducers/ui'
import { filteredBooks } from '@store/selectors/aggregated/books'
import { booksSelector } from '@store/selectors/books'
import { uiSelector } from '@store/selectors/ui'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const HomeRoot = () => {
  const dispatch = useDispatch()
  const availableBooks = useSelector(booksSelector.books)
  const loader = useSelector(uiSelector.loaderState)
  const books = useSelector(filteredBooks)

  const navigate = useNavigate()

  return (
    <Home
      books={books}
      isAddingBook={loader[LOADER_STATE.IS_ADDING_BOOK]?.status === LOADER_STATUS.LOADING}
      isLoadingState={loader[LOADER_STATE.IS_LOADING_STATE]?.status === LOADER_STATUS.LOADING}
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
        dispatch(actions.setOpenBook({ id, format }))
        dispatch(uiActions.setHideHeader(true))
      }}
    />
  )
}

export default HomeRoot
