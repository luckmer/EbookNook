import Reader from '@pages/Reader'
import { bookSelector } from '@store/selectors/books'
import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

const ReaderRoot = () => {
  const chaptersMap = useSelector(bookSelector.chapters)
  const location = useLocation()
  const navigate = useNavigate()

  const hash = useMemo(() => location?.state?.id, [location])

  const chapters = useMemo(() => chaptersMap[hash] ?? [], [hash, chaptersMap])

  useEffect(() => {
    if (!chapters) {
      navigate('/')
    }
  }, [chapters])

  return <Reader chapters={chapters} onClickBack={() => navigate('/')} />
}

export default ReaderRoot
