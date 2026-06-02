import type { FormatType } from '@bindings/format'
import Header from '@pages/Header'
import { actions } from '@store/reducers/search'
import { actions as uiActions } from '@store/reducers/ui'
import { bookmarksSelector } from '@store/selectors/bookmarks'
import { booksSelector } from '@store/selectors/books'
import { readerSelector } from '@store/selectors/reader'
import { searchSelector } from '@store/selectors/search'
import { uiSelector } from '@store/selectors/ui'
import '@styles/import.css'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { isActiveCFI } from '@utils/compareCFI'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const HeaderRoot = () => {
  const isSettingsOpen = useSelector(uiSelector.openSettingsModal)
  const isSidebarOpen = useSelector(uiSelector.openChaptersDrawer)
  const searchValue = useSelector(searchSelector.value)
  const hideHeader = useSelector(uiSelector.hideHeader)
  const booksMap = useSelector(booksSelector.books)
  const bookmarksState = useSelector(bookmarksSelector.bookmarks)
  const readerLocation = useSelector(readerSelector.readerLocation)

  const location = useLocation()
  const dispatch = useDispatch()

  const bookState = useMemo<{ id: string; format: FormatType } | null>(
    () => location?.state,
    [location],
  )

  const book = useMemo(() => {
    if (!bookState) return
    return booksMap[bookState.format]?.[bookState.id]
  }, [bookState, booksMap])

  const bookmarks = useMemo(
    () => (book ? (bookmarksState[book.id] ?? []) : []),
    [bookmarksState, book],
  )

  const isBookmarkActive = useMemo(() => {
    return bookmarks.some((b) => isActiveCFI(b.cfi, readerLocation.cfi))
  }, [readerLocation.cfi, bookmarks])

  console.log(bookmarks, readerLocation.cfi)
  return (
    <Header
      isBookmarkActive={isBookmarkActive}
      bookName={book?.metadata.title}
      hideHeader={hideHeader}
      onClickBookmark={() => dispatch(uiActions.setOpenCreateBookmarkModal(true))}
      onClickSettings={() => dispatch(uiActions.setOpenSettingsModal(!isSettingsOpen))}
      location={location.pathname}
      onClickOpenSidebar={() => dispatch(uiActions.setOpenChaptersDrawer(!isSidebarOpen))}
      value={searchValue}
      onChange={(value) => dispatch(actions.setValue(value))}
      onClickClose={async () => {
        try {
          await getCurrentWindow().close()
        } catch (err) {
          console.error('failed to close', err)
        }
      }}
      onClickMaximize={async () => {
        try {
          await getCurrentWindow().toggleMaximize()
        } catch (err) {
          console.error('failed to maximize', err)
        }
      }}
      onClickMinimize={async () => {
        try {
          await getCurrentWindow().minimize()
        } catch (err) {
          console.error('failed to minimize', err)
        }
      }}
    />
  )
}

export default HeaderRoot
