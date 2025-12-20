import Home from '@pages/Home'
import { actions } from '@store/reducers/books'
import { actions as uiActions } from '@store/reducers/ui'
import { filteredBooks } from '@store/selectors/aggregated/books'
import { bookSelector } from '@store/selectors/books'
import { invoke } from '@tauri-apps/api/core'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const HomeRoot = () => {
  const dispatch = useDispatch()
  const availableBooks = useSelector(bookSelector.books)
  const books = useSelector(filteredBooks)

  const navigate = useNavigate()

  return (
    <Home
      books={books}
      hasBooks={Object.values(availableBooks).length > 0}
      onClick={async (file) => {
        try {
          console.log('dsdsds')
          await invoke('add_book', {
            book: {
              id: Math.floor(Math.random() * 4343).toString(),
              title: 'new book',
              author: 'myself',
              language: 'en',
            },
          })
        } catch (err) {
          console.log('got error', err)
        }
        // dispatch(actions.importBook(file))
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
