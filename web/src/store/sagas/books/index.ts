import type { IBindingsBook, IBindingsBookStructure } from '@bindings/book'
import type { IBindingsMetadata } from '@bindings/metadata'
import type { IBindingsProgress } from '@bindings/progress'
import { LOADER_STATE, LOADER_STATUS } from '@interfaces/ui/enums'
import { getAppClient } from '@libs/appService'
import { getBookAdapterClient } from '@libs/BookAdapter'
import { getDocumentClient } from '@libs/document'
import type { PayloadAction } from '@reduxjs/toolkit'
import { actions, type PayloadTypes } from '@store/reducers/books'
import { actions as uiActions } from '@store/reducers/ui'
import { booksSelector } from '@store/selectors/books'
import { invoke } from '@tauri-apps/api/core'
import { notify } from '@utils/notification'
import { all, call, put, select, takeEvery, takeLatest } from 'typed-redux-saga'

export function* loadState() {
  try {
    yield* put(
      uiActions.setLoaderState({
        loader: LOADER_STATE.IS_LOADING_STATE,
        state: { status: LOADER_STATUS.LOADING },
      }),
    )

    const booksResponse = yield* call(invoke<Array<IBindingsBook>>, 'get_books')
    const adapterClient = yield* call(getBookAdapterClient)

    const updatedBooks: Record<string, IBindingsBook> = {}

    for (const book of booksResponse) {
      const cover = yield* call([adapterClient, adapterClient.getBookImg], book.id)
      book.metadata.cover = cover

      updatedBooks[book.id] = book
    }

    yield* put(actions.setBooks(updatedBooks))
  } catch (err) {
    console.log('failed to get state', err)
    notify('Failed to open document', 'error')
  }

  yield* put(
    uiActions.setLoaderState({
      loader: LOADER_STATE.IS_LOADING_STATE,
      state: { status: LOADER_STATUS.IDLE },
    }),
  )
}

export function* ImportBook(action: PayloadAction<PayloadTypes['importBook']>) {
  yield* put(
    uiActions.setLoaderState({
      loader: LOADER_STATE.IS_ADDING_BOOK,
      state: { status: LOADER_STATUS.LOADING },
    }),
  )

  try {
    const core = yield* call(getDocumentClient)
    const appService = yield* call(getAppClient)
    const response = yield* call([core, core.init], action.payload)
    const adapterClient = yield* call(getBookAdapterClient)

    const bookFormat = yield* call([adapterClient, adapterClient.invokeBookFormat], response)

    yield* call(invoke<IBindingsBook>, 'add_book', { book: bookFormat })
    const bookImg = yield* call([response, response.getCover])
    yield* all([
      call([appService, appService.saveCover], response.id, bookImg),
      call([appService, appService.saveBookToStorage], action.payload, response.id),
    ])

    const cover = yield* call([adapterClient, adapterClient.getBookImg], bookFormat.id)
    const bookContent = bookFormat

    bookContent.metadata.cover = cover

    yield* put(actions.setBook({ id: response.id, book: bookContent }))
  } catch (err) {
    console.log(err)
    console.log('failed to open document')
    notify('Failed to open document', 'error')
  }

  yield* put(
    uiActions.setLoaderState({
      loader: LOADER_STATE.IS_ADDING_BOOK,
      state: { status: LOADER_STATUS.IDLE },
    }),
  )
}

export function* setOpenBook(id: string) {
  try {
    const files = yield* select(booksSelector.files)
    if (files[id]) {
      yield* put(
        uiActions.setLoaderState({
          loader: LOADER_STATE.IS_FETCHING_STRUCTURE,
          state: { status: LOADER_STATUS.IDLE },
        }),
      )
      return
    }

    const appService = yield* call(getAppClient)
    const file = yield* call([appService, appService.loadBookFromStorage], id)

    yield* put(actions.setFile({ id, file: file }))
  } catch (err) {
    console.log(err)
    console.log('failed to open document')
    notify('Failed to open document', 'error')
  }
}

export function* getBookStructure(id: string) {
  try {
    const structure = yield* call(invoke<IBindingsBookStructure>, 'get_book_structure', { id })

    yield* put(actions.setBookStructure(structure))
  } catch (err) {
    console.log(err)
    console.log('Failed to get book structure')
    notify('Failed to get book structure', 'error')
  }
}

export function* deleteBook(action: PayloadAction<PayloadTypes['deleteBook']>) {
  yield* put(
    uiActions.setScopedLoaderState({
      scope: action.payload.id,
      loader: LOADER_STATE.IS_DELETING_BOOK,
      state: { status: LOADER_STATUS.LOADING },
    }),
  )

  try {
    yield* call(invoke, 'delete_book', { id: action.payload.id, format: action.payload.format })

    const appService = yield* call(getAppClient)

    yield* all([
      call([appService, appService.deleteBookFromStorage], action.payload.id),
      put(actions.deleteBook(action.payload)),
    ])
  } catch (err) {
    console.log(err)
    console.log(`failed to remove ${action.payload.format}`)
    notify(`Failed to remove ${action.payload.format}`, 'error')
  }

  yield* put(
    uiActions.setScopedLoaderState({
      scope: action.payload.id,
      loader: LOADER_STATE.IS_DELETING_BOOK,
      state: { status: LOADER_STATUS.IDLE },
    }),
  )
}

export function* updateBookMetadata(action: PayloadAction<PayloadTypes['updateBookMetadata']>) {
  yield* put(
    uiActions.setScopedLoaderState({
      scope: action.payload.id,
      loader: LOADER_STATE.IS_UPDATING_BOOK,
      state: { status: LOADER_STATUS.LOADING },
    }),
  )

  try {
    yield* call(invoke<IBindingsMetadata>, 'update_book_metadata', {
      metadata: action.payload,
    })

    yield* all([
      put(
        actions.setUpdateBookMetadata({
          id: action.payload.id,
          metadata: action.payload,
        }),
      ),
    ])
  } catch (err) {
    console.log(err)
    console.log(`failed to update book ${action.payload.format}`)

    notify(`Failed to update ${action.payload.format}`, 'error')
  }

  yield* put(
    uiActions.setScopedLoaderState({
      scope: action.payload.id,
      loader: LOADER_STATE.IS_UPDATING_BOOK,
      state: { status: LOADER_STATUS.IDLE },
    }),
  )
}

export function* updateBookProgress(action: PayloadAction<PayloadTypes['updateBookProgress']>) {
  try {
    yield* call(invoke<IBindingsProgress>, 'update_book_progress', {
      progress: action.payload,
    })

    yield* put(actions.setUpdateBookProgress(action.payload))
  } catch (err) {
    console.log(err)
    console.log('Failed to update progress')
    notify('Failed to update progress', 'error')
  }
}

export function* updateBookProgressSaga() {
  yield* takeEvery(actions.updateBookProgress, updateBookProgress)
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

export function* loadStateSaga() {
  yield* takeLatest(actions.load, loadState)
}

export default function* RootSaga() {
  yield all([
    ImportBookSaga(),
    loadStateSaga(),
    updateBookMetadataSaga(),
    updateBookProgressSaga(),
    deleteBookSagas(),
  ])
}
