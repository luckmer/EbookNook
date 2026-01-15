import ChaptersDrawer from '@pages/chaptersDrawer'
import { actions as uiActions } from '@store/reducers/ui'
import { actions as bookActions } from '@store/reducers/books'
import { selectEpubMap } from '@store/selectors/books'
import { uiSelector } from '@store/selectors/ui'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

const ChaptersDrawerRoot = () => {
  const booksMap = useSelector(selectEpubMap)
  const isOpen = useSelector(uiSelector.openChaptersDrawer)
  const navigate = useNavigate()

  const location = useLocation()
  const dispatch = useDispatch()

  const hash = useMemo(() => location?.state?.id, [location])
  const book = useMemo(() => booksMap[hash], [hash, booksMap])

  return (
    <ChaptersDrawer
      author={book?.book.author ?? '--'}
      icon={book?.book.metadata?.cover}
      title={book?.book.title ?? '--'}
      toc={book?.toc ?? []}
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
