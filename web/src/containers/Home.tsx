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
      onClick={async (file) => {
        console.log('make request')
        dispatch(actions.importBook(file))
      }}
    />
  )
}

export default HomeRoot
