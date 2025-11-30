import Reader from '@pages/Reader'
import { actions } from '@store/reducers/ui'
import { bookSelector } from '@store/selectors/books'
import { settingsConfig } from '@store/selectors/settings'
import { uiSelector } from '@store/selectors/ui'
import { useDispatch, useSelector } from 'react-redux'

const ReaderRoot = () => {
  const selectedChapter = useSelector(bookSelector.selectedChapter)
  const epubCodeSearch = useSelector(bookSelector.epubCodeSearch)
  const hideContent = useSelector(uiSelector.hideHeader)
  const settings = useSelector(settingsConfig)
  const dispatch = useDispatch()

  return (
    <Reader
      settings={settings}
      hideContent={hideContent}
      epubCodeSearch={epubCodeSearch}
      selectedChapter={selectedChapter}
      onHideHeader={() => {
        dispatch(actions.setHideHeader(true))
      }}
      onShowHeader={() => {
        dispatch(actions.setHideHeader(false))
      }}
    />
  )
}

export default ReaderRoot
