import Reader from '@pages/Reader'
import { bookSelector } from '@store/selectors/books'
import { useSelector } from 'react-redux'

const ReaderRoot = () => {
  const selectedChapter = useSelector(bookSelector.selectedChapter)
  const epubCodeSearch = useSelector(bookSelector.epubCodeSearch)

  return <Reader epubCodeSearch={epubCodeSearch} selectedChapter={selectedChapter} />
}

export default ReaderRoot
