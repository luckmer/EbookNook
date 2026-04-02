import DrawersRoot from '@containers/Drawers'
import { NotificationsRoot } from '@containers/notifications'
import store from '@store/store'
import { ConfigProvider } from 'antd'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { theme } from '../../packages/ui/common/antTheme'
import App from './App'
import ModalsRoot from './containers/Modals'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ConfigProvider theme={theme}>
    <Provider store={store}>
      <BrowserRouter>
        <NotificationsRoot />
        <DrawersRoot />
        <ModalsRoot />
        <App />
      </BrowserRouter>
    </Provider>
  </ConfigProvider>,
)
