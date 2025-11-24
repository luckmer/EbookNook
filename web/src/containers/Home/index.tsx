import Home from '@pages/Home'
import { actions } from '@store/reducers/books'
import { actions as uiActions } from '@store/reducers/ui'
import { bookSelector } from '@store/selectors/books'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const HomeRoot = () => {
  const dispatch = useDispatch()
  const books = useSelector(bookSelector.books)

  const navigate = useNavigate()

  return (
    <Home
      books={books}
      onClick={async (file) => {
        dispatch(actions.importBook(file))
      }}
      onClickBook={(hash) => {
        navigate('reader', { state: { id: hash } })
        dispatch(actions.loadBook(hash))
        dispatch(uiActions.setHideHeader(true))
      }}
    />
  )
}

export default HomeRoot
