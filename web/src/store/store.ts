import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { batchDispatchMiddleware } from 'redux-batched-actions'
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

sagaMiddleware.run(Saga)

export default store
