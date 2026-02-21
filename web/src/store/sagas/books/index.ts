import { Books } from '@bindings/book'
import { PayloadAction } from '@reduxjs/toolkit'
import { actions, PayloadTypes } from '@store/reducers/books'
import { actions as uiActions } from '@store/reducers/ui'
import { invoke } from '@tauri-apps/api/core'
import { getDocumentLoader } from 'src/libs/document'
import { all, call, put, takeEvery, takeLatest, takeLeading } from 'typed-redux-saga'
import { deleteEpubBook, editEpubBook, getEpubStructure, updateEpubBookProgress } from './epub'

export function* loadState() {
  yield* put(uiActions.setIsLoadingState(true))
  const books = yield* call(invoke<Books>, 'get_books')
  yield* put(actions.setBooks(books))
  yield* put(uiActions.setIsLoadingState(false))
}

export function* ImportBook(action: PayloadAction<PayloadTypes['importBook']>) {
  try {
    const core = yield* call(getDocumentLoader)
    const response = yield* call([core, core.init], action.payload)

    yield* call(invoke, 'add_epub_book', {
      epub: response,
    })

    yield* put(actions.setEpubBook(response))
  } catch (err) {
    console.log(err)
    console.log('failed to open document')
  }
}

export function* ImportBookSaga() {
  yield* takeEvery(actions.importBook, ImportBook)
}

export function* loadStateSaga() {
  yield* takeLatest(actions.load, loadState)
}

export function* getEpubStructureSaga() {
  yield* takeLatest(actions.getEpubStructure, getEpubStructure)
}

export function* updateEpubBookProgressSaga() {
  yield* takeLeading(actions.setUpdateEpubBookProgress, updateEpubBookProgress)
}

export function* deleteEpubSaga() {
  yield* takeEvery(actions.deleteEpub, deleteEpubBook)
}

export function* editEpubSaga() {
  yield* takeEvery(actions.editEpub, editEpubBook)
}

export default function* RootSaga() {
  yield all([
    ImportBookSaga(),
    loadStateSaga(),
    getEpubStructureSaga(),
    updateEpubBookProgressSaga(),
    deleteEpubSaga(),
    editEpubSaga(),
  ])
}
