import Reader from '@pages/Reader'
import { bookSelector } from '@store/selectors/books'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const ReaderRoot = () => {
  const chaptersMap = useSelector(bookSelector.chapters)
  const selectedChapter = useSelector(bookSelector.selectedChapter)
  const location = useLocation()

  const hash = useMemo(() => location?.state?.id, [location])
  const chapters = useMemo(() => chaptersMap[hash] ?? [], [hash, chaptersMap])

  return <Reader selectedChapter={selectedChapter} chapters={chapters} />
}

export default ReaderRoot
