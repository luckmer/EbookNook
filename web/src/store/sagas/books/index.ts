import { IBookFile } from '@bindings/book'
import { getAppClient } from '@libs/appService'
import { getBookAdapterClient } from '@libs/BookAdapter'
import { PayloadAction } from '@reduxjs/toolkit'
import { actions, PayloadTypes } from '@store/reducers/books'
import { actions as uiActions } from '@store/reducers/ui'
import { bookSelector } from '@store/selectors/books'
import { invoke } from '@tauri-apps/api/core'
import { notify } from '@utils/notification'
import { getDocumentClient } from 'src/libs/document'
import { all, call, put, select, takeEvery, takeLatest } from 'typed-redux-saga'

export function* loadState() {
  try {
    yield* put(uiActions.setIsLoadingState(true))
    const booksResponse = yield* call(invoke<IBookFile[]>, 'get_books')

    const books: Record<string, IBookFile> = {}

    const adapterClient = yield* call(getBookAdapterClient)

    for (let book of booksResponse) {
      const bookContent = yield* call([adapterClient, adapterClient.getBookImg], book)
      books[book.id] = bookContent
    }

    yield* put(actions.setBooks(books))
  } catch (err) {
    console.log('failed to get state')
    notify('Failed to open document', 'error')
  }

  yield* put(uiActions.setIsLoadingState(false))
}

export function* ImportBook(action: PayloadAction<PayloadTypes['importBook']>) {
  yield* put(uiActions.setIsAddingBook(true))
  try {
    const core = yield* call(getDocumentClient)
    const appService = yield* call(getAppClient)

    const response = yield* call([core, core.init], action.payload)

    const bookImg = yield* call([response, response.getCover])

    yield* all([
      call([appService, appService.saveCover], response.id, bookImg),
      call([appService, appService.saveBookToStorage], action.payload, response.id),
    ])

    const adapterClient = yield* call(getBookAdapterClient)

    const bookFormat = yield* call([adapterClient, adapterClient.invokeBookFormat], response)
    // yield* call(invoke<IBookFile>, 'add_book', {
    //   book: bookFormat,
    // })

    const bookContent = yield* call([adapterClient, adapterClient.getBookFormat], response)

    yield* put(actions.setBook({ id: response.id, book: bookContent }))
  } catch (err) {
    console.log(err)
    console.log('failed to open document')
    notify('Failed to open document', 'error')
  }
  yield* put(uiActions.setIsAddingBook(false))
}

export function* setOpenBook(action: PayloadAction<PayloadTypes['setOpenBook']>) {
  yield* put(uiActions.setIsFetchingStructure(true))
  try {
    const files = yield* select(bookSelector.files)

    if (files[action.payload]) {
      yield* put(uiActions.setIsFetchingStructure(false))
      return
    }

    const books = yield* select(bookSelector.books)

    const book = books[action.payload]

    if (!book) {
      throw new Error('Book not found')
    }

    const appService = yield* call(getAppClient)

    const file = yield* call([appService, appService.loadBookFromStorage], action.payload)

    yield* put(actions.setFile({ id: action.payload, file: file }))
  } catch (err) {
    console.log(err)
    console.log('failed to open document')
    notify('Failed to open document', 'error')
  }

  yield* put(uiActions.setIsFetchingStructure(false))
}

export function* ImportBookSaga() {
  yield* takeEvery(actions.importBook, ImportBook)
}

export function* loadStateSaga() {
  yield* takeLatest(actions.load, loadState)
}

export function* setOpenBookSaga() {
  yield* takeLatest(actions.setOpenBook, setOpenBook)
}

export default function* RootSaga() {
  yield all([ImportBookSaga(), loadStateSaga(), setOpenBookSaga()])
}
