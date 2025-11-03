import { PayloadAction } from '@reduxjs/toolkit'
import { actions, PayloadTypes } from '@store/reducers/books'
import { booksMapSelector } from '@store/selectors/books'
import { getDocumentLoader } from 'src/libs/document'
import { all, call, put, select, takeEvery, takeLatest } from 'typed-redux-saga'

export function* ImportBook(action: PayloadAction<PayloadTypes['importBook']>) {
  try {
    const bookMap = yield* select(booksMapSelector)
    const core = yield* call(getDocumentLoader)
    const book = yield* call([core, core.open], action.payload)

    if (bookMap[book.book.hash]) {
      // or can we update the book ?
      return
    }

    yield* put(actions.setBook(book.book))
  } catch (err) {
    console.log(err)
    console.log('failed to open document')
  }
}

export function* loadBook(action: PayloadAction<PayloadTypes['loadBook']>) {
  try {
    const hash = action.payload
    const bookMap = yield* select(booksMapSelector)

    const book = bookMap[hash]

    if (!book) {
      throw new Error('book not found')
    }

    const filePath = book.rootFilePath

    const core = yield* call(getDocumentLoader)
    yield* call([core, core.loadBook], filePath)
  } catch (err) {
    console.log('failed to load book')
  }
}

export function* ImportBookSaga() {
  yield* takeEvery(actions.importBook, ImportBook)
}

export function* loadBookSaga() {
  yield* takeLatest(actions.loadBook, loadBook)
}

export default function* RootSaga() {
  yield all([ImportBookSaga(), loadBookSaga()])
}
