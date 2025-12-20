import { PayloadAction } from '@reduxjs/toolkit'
import { actions, PayloadTypes } from '@store/reducers/books'
import { bookSelector } from '@store/selectors/books'
import { invoke } from '@tauri-apps/api/core'
import { getDocumentLoader } from 'src/libs/document'
import { all, call, select, takeEvery } from 'typed-redux-saga'

export function* ImportBook(action: PayloadAction<PayloadTypes['importBook']>) {
  try {
    const bookMap = yield* select(bookSelector.books)
    const core = yield* call(getDocumentLoader)
    const response = yield* call([core, core.init], action.payload)

    if (bookMap[response.book.hash]) {
      // TODO
      return
    }

    yield* call(invoke, 'add_book', {
      book: response.book,
    })
  } catch (err) {
    console.log(err)
    console.log('failed to open document')
  }
}

export function* ImportBookSaga() {
  yield* takeEvery(actions.importBook, ImportBook)
}

export function* loadBookSaga() {
  // yield* takeLatest(actions.loadBook, loadBook)
}

export default function* RootSaga() {
  yield all([ImportBookSaga(), loadBookSaga()])
}
