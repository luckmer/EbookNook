import ChaptersDrawer from '@pages/chaptersDrawer'
import { actions as uiActions } from '@store/reducers/ui'
import { bookSelector, booksMapSelector } from '@store/selectors/books'
import { uiSelector } from '@store/selectors/ui'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const ChaptersDrawerRoot = () => {
  const booksMap = useSelector(booksMapSelector)
  const isOpen = useSelector(uiSelector.openChaptersDrawer)
  const tocMap = useSelector(bookSelector.toc)

  const location = useLocation()
  const dispatch = useDispatch()

  const hash = useMemo(() => location?.state?.id, [location])

  const toc = useMemo(() => tocMap[hash] ?? [], [hash, tocMap])
  const book = useMemo(() => booksMap[hash], [hash, booksMap])

  return (
    <ChaptersDrawer
      author={book?.author ?? '--'}
      icon={book?.metadata?.cover}
      title={book?.title ?? '--'}
      toc={toc}
      isOpen={isOpen}
      onClickClose={() => {
        dispatch(uiActions.setOpenChaptersDrawer(false))
      }}
      onClick={() => {}}
    />
  )
}

export default ChaptersDrawerRoot
