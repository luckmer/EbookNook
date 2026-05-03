import { IBookMetadata } from '@bindings/book'
import { FormatType } from '@bindings/format'
import { BOOK_STATUS } from '@interfaces/book/enums'
import { Books, IBookStructure, IBookType } from '@interfaces/book/types'
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
    const booksResponse = yield* call(invoke<Books>, 'get_books')
    const adapterClient = yield* call(getBookAdapterClient)

    const updateBooks: Partial<Record<FormatType, Partial<Record<string, IBookType>>>> = {}

    for (const books of Object.values(booksResponse)) {
      for (const book of books) {
        const cover = yield* call([adapterClient, adapterClient.getBookImg], book.id)
        book.metadata.cover = cover

        updateBooks[book.format] = { ...updateBooks[book.format], [book.id]: book }
      }
    }

    yield* put(actions.setBooks(updateBooks))
  } catch (err) {
    console.log('failed to get state', err)
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
    const adapterClient = yield* call(getBookAdapterClient)
    const bookFormat = yield* call([adapterClient, adapterClient.invokeBookFormat], response)

    yield* call(invoke<IBookType>, 'add_book', { book: bookFormat })

    const bookImg = yield* call([response, response.getCover])
    yield* all([
      call([appService, appService.saveCover], response.id, bookImg),
      call([appService, appService.saveBookToStorage], action.payload, response.id),
    ])

    const cover = yield* call([adapterClient, adapterClient.getBookImg], bookFormat.book.id)

    const bookContent = bookFormat.book
    bookContent.metadata.cover = cover

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

export function* getBookStructure(action: PayloadAction<PayloadTypes['getBookStructure']>) {
  try {
    const structure = yield* call(invoke<IBookStructure>, 'get_book_structure_by_id', {
      id: action.payload.id,
      format: action.payload.format,
    })

    yield* put(actions.setBookStructure({ id: action.payload.id, structure }))
  } catch (err) {
    console.log(err)
    console.log('Failed to get book structure')
    notify('Failed to get book structure', 'error')
  }
}

export function* deleteBook(action: PayloadAction<PayloadTypes['deleteBook']>) {
  try {
    yield* put(actions.setStatus({ id: action.payload.id, status: BOOK_STATUS.DELETING }))
    yield* call(invoke, 'delete_book', { id: action.payload.id, format: action.payload.format })

    const appService = yield* call(getAppClient)

    yield* all([
      call([appService, appService.deleteBookFromStorage], action.payload.id),
      put(actions.setStatus({ id: action.payload.id, status: BOOK_STATUS.SUCCESS })),
      put(actions.deleteBook(action.payload)),
    ])
  } catch (err) {
    console.log(err)
    console.log(`failed to remove ${action.payload.format}`)
    yield* put(actions.setStatus({ id: action.payload.id, status: BOOK_STATUS.ERROR }))
    notify(`Failed to remove ${action.payload.format}`, 'error')
  }
}

export function* updateBookMetadata(action: PayloadAction<PayloadTypes['updateBookMetadata']>) {
  try {
    yield* put(actions.setStatus({ id: action.payload.id, status: BOOK_STATUS.UPDATING }))
    const result = yield* call(invoke<IBookMetadata>, 'update_book_metadata', {
      id: action.payload.id,
      metadata: { format: action.payload.format, metadata: action.payload.metadata },
    })

    yield* all([
      put(actions.setStatus({ id: action.payload.id, status: BOOK_STATUS.SUCCESS })),
      put(
        actions.setUpdateBookMetadata({
          id: action.payload.id,
          format: action.payload.format,
          metadata: result,
        }),
      ),
    ])
  } catch (err) {
    console.log(err)
    console.log(`failed to update book ${action.payload.format}`)
    yield* put(actions.setStatus({ id: action.payload.id, status: BOOK_STATUS.ERROR }))
    notify(`Failed to update ${action.payload.format}`, 'error')
  }
}

export function* ImportBookSaga() {
  yield* takeEvery(actions.importBook, ImportBook)
}

export function* deleteBookSagas() {
  yield* takeEvery(actions.setDeleteBook, deleteBook)
}

export function* updateBookMetadataSaga() {
  yield* takeLatest(actions.updateBookMetadata, updateBookMetadata)
}

export function* getBookStructureSaga() {
  yield* takeLatest(actions.getBookStructure, getBookStructure)
}

export function* loadStateSaga() {
  yield* takeLatest(actions.load, loadState)
}

export function* setOpenBookSaga() {
  yield* takeLatest(actions.setOpenBook, setOpenBook)
}

export default function* RootSaga() {
  yield all([
    ImportBookSaga(),
    loadStateSaga(),
    setOpenBookSaga(),
    getBookStructureSaga(),
    updateBookMetadataSaga(),
    deleteBookSagas(),
  ])
}
