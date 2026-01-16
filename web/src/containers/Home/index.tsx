import Home from '@pages/Home'
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
  const books = useSelector(filteredBooks)

  const navigate = useNavigate()

  return (
    <Home
      books={books}
      isLoadingState={isLoadingState}
      hasBooks={Object.values(availableBooks).flat().length > 0}
      onClick={async (file) => {
        dispatch(actions.importBook(file))
      }}
      onClickBook={(id) => {
        navigate('reader', { state: { id } })
        dispatch(actions.getEpubStructure(id))
        dispatch(uiActions.setHideHeader(true))
      }}
    />
  )
}

export default HomeRoot
