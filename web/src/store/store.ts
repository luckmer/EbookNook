import { configureStore } from '@reduxjs/toolkit'
import { batchDispatchMiddleware } from 'redux-batched-actions'
import { persistStore } from 'redux-persist'
import createSagaMiddleware from 'redux-saga'
import reducer from './reducers'
import Saga from './sagas'

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
