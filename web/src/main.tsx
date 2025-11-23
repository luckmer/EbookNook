import DrawersRoot from '@containers/Drawers'
import store from '@store/store'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ConfigProvider } from 'antd'
import { theme } from '../../packages/ui/common/antTheme'
import ModalsRoot from './containers/Modals'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ConfigProvider theme={theme}>
    <Provider store={store}>
      <BrowserRouter>
        <DrawersRoot />
        <ModalsRoot />
        <App />
      </BrowserRouter>
    </Provider>
  </ConfigProvider>
)
