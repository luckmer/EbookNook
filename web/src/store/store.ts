import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { batchDispatchMiddleware } from 'redux-batched-actions'
import reducer from './reducers'
import Saga from './sagas'
import { persistStore } from 'redux-persist'

const sagaMiddleware = createSagaMiddleware()
const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat([sagaMiddleware, batchDispatchMiddleware]),
})

persistStore(store)
sagaMiddleware.run(Saga)

export default store
