import { PayloadAction } from '@reduxjs/toolkit'
import { actions, PayloadTypes } from '@store/reducers/books'
import { getDocumentLoader } from 'src/libs/document'
import { all, call, put, takeEvery } from 'typed-redux-saga'

export function* ImportBook(action: PayloadAction<PayloadTypes['importBook']>) {
  try {
    console.log('got request', action.payload)
    const core = yield* call(getDocumentLoader, action.payload)
    const book = yield* call([core, core.open])
    yield* put(actions.setBook(book.book))
  } catch (err) {
    console.log(err)
    console.log('failed to open document')
  }
}

export function* ImportBookSaga() {
  yield* takeEvery(actions.importBook, ImportBook)
}

export default function* RootSaga() {
  yield all([ImportBookSaga()])
}
