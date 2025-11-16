import Reader from '@pages/Reader'
import { bookSelector } from '@store/selectors/books'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

const ReaderRoot = () => {
  const chaptersMap = useSelector(bookSelector.chapters)
  const selectedChapter = useSelector(bookSelector.selectedChapter)
  const location = useLocation()
  const navigate = useNavigate()

  const hash = useMemo(() => location?.state?.id, [location])

  const chapters = useMemo(() => chaptersMap[hash] ?? [], [hash, chaptersMap])

  return (
    <Reader
      selectedChapter={selectedChapter}
      chapters={chapters}
      onClickBack={() => navigate('/')}
    />
  )
}

export default ReaderRoot
