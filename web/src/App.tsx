import Header from '@pages/Home/Header'
import '@styles/import.css'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { Route, Routes } from 'react-router-dom'
import { routes } from './routes'

function App() {
  return (
    <div className="w-full h-full flex flex-col gap-4 py-4 px-4">
      <Header
        value=""
        onChange={() => {}}
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
      <div className="w-full h-full flex flex-row  gap-4">
        <div className="overflow-hidden h-full w-full">
          <Routes>
            {routes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element()} />
            ))}
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App
