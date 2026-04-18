import ChaptersDrawer from '@pages/Drawers/chaptersDrawer'
import { actions as bookActions } from '@store/reducers/books'
import { actions as uiActions } from '@store/reducers/ui'
import { bookSelector } from '@store/selectors/books'
import { uiSelector } from '@store/selectors/ui'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

const ChaptersDrawerRoot = () => {
  const [cache, setCache] = useState('')
  const isOpen = useSelector(uiSelector.openChaptersDrawer)
  const isLoader = useSelector(uiSelector.isFetchingStructure)
  const books = useSelector(bookSelector.books)
  const activeToc = useSelector(bookSelector.activeToc)

  const navigate = useNavigate()

  const location = useLocation()
  const dispatch = useDispatch()

  const bookId = useMemo(() => location?.state?.id, [location])
  const activeBook = useMemo(() => books[cache], [cache, books])

  const bookMetadata = useMemo(() => {
    return books[cache]
  }, [books, cache])

  useEffect(() => {
    if (!bookId) return
    if (bookId !== cache) {
      setCache(bookId)
    }
  }, [bookId])

  const author = useMemo(() => {
    const author = activeBook?.metadata?.author

    if (!author) {
      return '--'
    }

    if (typeof author === 'string') {
      return author
    }

    return typeof author.name === 'string' ? author.name : '----'
  }, [activeBook])

  const title = useMemo(() => {
    const title = activeBook?.metadata?.title

    console.log('title', title)
    if (!title) {
      return '--'
    }

    if (typeof title === 'string') {
      return title
    }

    return typeof title.name === 'string' ? title.name : '----'
  }, [activeBook])

  return (
    <ChaptersDrawer
      activeToc={activeToc}
      author={author}
      icon={bookMetadata?.metadata?.cover}
      title={title}
      toc={activeBook?.toc ?? []}
      isLoader={isLoader}
      isOpen={isOpen}
      onClickBack={() => {
        dispatch(uiActions.setOpenChaptersDrawer(false))
        dispatch(bookActions.setSelectedChapter(''))
        navigate('/')
      }}
      onClickClose={() => {
        dispatch(uiActions.setOpenChaptersDrawer(false))
      }}
      onClick={(href) => {
        dispatch(bookActions.setSelectedChapter(href))
      }}
    />
  )
}

export default ChaptersDrawerRoot
