import Header from '@pages/Header'
import { actions as bookActions } from '@store/reducers/books/index'
import { actions } from '@store/reducers/search'
import { actions as uiActions } from '@store/reducers/ui'
import { searchSelector } from '@store/selectors/search'
import { uiSelector } from '@store/selectors/ui'
import '@styles/import.css'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import { routes } from './routes'

function App() {
  const isSettingsOpen = useSelector(uiSelector.openSettingsModal)
  const isSidebarOpen = useSelector(uiSelector.openChaptersDrawer)
  const searchValue = useSelector(searchSelector.value)
  const hideHeader = useSelector(uiSelector.hideHeader)
  const dispatch = useDispatch()

  useLayoutEffect(() => {
    dispatch(bookActions.load())
  }, [])

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <Header
        hideHeader={hideHeader}
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
      <div className="overflow-hidden h-full w-full">
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element()} />
          ))}
        </Routes>
      </div>
    </div>
  )
}

export default App
