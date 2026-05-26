import { FormatType } from '@bindings/format'
import Header from '@pages/Header'
import { actions } from '@store/reducers/search'
import { actions as uiActions } from '@store/reducers/ui'
import { booksSelector } from '@store/selectors/books'
import { searchSelector } from '@store/selectors/search'
import { uiSelector } from '@store/selectors/ui'
import '@styles/import.css'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const HeaderRoot = () => {
  const isSettingsOpen = useSelector(uiSelector.openSettingsModal)
  const isSidebarOpen = useSelector(uiSelector.openChaptersDrawer)
  const searchValue = useSelector(searchSelector.value)
  const hideHeader = useSelector(uiSelector.hideHeader)
  const booksMap = useSelector(booksSelector.books)
  const location = useLocation()
  const dispatch = useDispatch()

  const bookState: {
    id: string
    format: FormatType
  } = useMemo(() => location?.state, [location])

  const book = useMemo(() => {
    if (!bookState) return

    const bookShelf = booksMap[bookState.format]

    if (!bookShelf) return

    return bookShelf[bookState.id]
  }, [bookState, booksMap])

  return (
    <Header
      isBookmarkActive={false}
      bookName={book?.metadata.title}
      hideHeader={hideHeader}
      onClickBookmark={() => {
        dispatch(uiActions.setOpenCreateBookmarkModal(true))
      }}
      onClickSettings={() => {
        dispatch(uiActions.setOpenSettingsModal(!isSettingsOpen))
      }}
      location={location.pathname}
      onClickOpenSidebar={() => {
        dispatch(uiActions.setOpenChaptersDrawer(!isSidebarOpen))
      }}
      value={searchValue}
      onChange={(value) => {
        dispatch(actions.setValue(value))
      }}
      onClickClose={async () => {
        try {
          const appWindow = getCurrentWindow()
          await appWindow.close()
        } catch (err) {
          console.log('failed to close', err)
        }
      }}
      onClickMaximize={async () => {
        try {
          const appWindow = getCurrentWindow()
          await appWindow.toggleMaximize()
        } catch (err) {
          console.log('failed to close', err)
        }
      }}
      onClickMinimize={async () => {
        try {
          const appWindow = getCurrentWindow()
          await appWindow.minimize()
        } catch (err) {
          console.log('failed to close', err)
        }
      }}
    />
  )
}

export default HeaderRoot
