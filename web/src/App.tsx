import { FormatType } from '@bindings/format'
import Annotator from '@containers/Annotator'
import Header from '@containers/Header'
import { actions as bookActions } from '@store/reducers/books/index'
import { booksSelector } from '@store/selectors/books'
import '@styles/import.css'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes, useLocation } from 'react-router-dom'
import { routes } from './routes'
function App() {
  const booksMap = useSelector(booksSelector.books)
  const dispatch = useDispatch()
  const location = useLocation()

  const isLoaded = useRef(false)

  useLayoutEffect(() => {
    dispatch(bookActions.load())
  }, [])

  const bookState: {
    id: string
    format: FormatType
  } = useMemo(() => location?.state, [location])

  useEffect(() => {
    if (!location?.state?.id || isLoaded.current) return

    const bookShelf = booksMap[bookState.format]
    if (!bookShelf) return

    const book = bookShelf[bookState.id]
    if (book) {
      isLoaded.current = true
      dispatch(bookActions.setOpenBook(book.id))
      dispatch(bookActions.getBookStructure({ id: book.id, format: book.format }))
    }
  }, [booksMap])

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <Header />
      <div className="overflow-hidden h-full w-full flex flex-col">
        <Annotator />
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element()} />
          ))}
        </Routes>
      </div>
    </div>
  )
}

export default App
