import DrawersRoot from '@containers/Drawers'
import store from '@store/store'
import { ConfigProvider } from 'antd'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { theme } from '../../packages/ui/common/antTheme'
import App from './App'
import ModalsRoot from './containers/Modals'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ConfigProvider theme={theme}>
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-center" visibleToasts={3} richColors />
        <DrawersRoot />
        <ModalsRoot />
        <App />
      </BrowserRouter>
    </Provider>
  </ConfigProvider>,
)
