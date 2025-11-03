import Home from '@pages/Home'
import { actions } from '@store/reducers/books'
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
        navigate(`/reader/${hash}`)
        dispatch(actions.loadBook(hash))
      }}
    />
  )
}

export default HomeRoot
