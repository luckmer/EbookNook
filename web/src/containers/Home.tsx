import Home from '@pages/Home'
import { actions } from '@store/reducers/books'
import { bookSelector } from '@store/selectors/books'
import { useDispatch, useSelector } from 'react-redux'

const HomeRoot = () => {
  const dispatch = useDispatch()
  const books = useSelector(bookSelector.books)

  console.log(books)

  return (
    <Home
      books={books}
      onClick={async (file) => {
        dispatch(actions.importBook(file))
      }}
    />
  )
}

export default HomeRoot
