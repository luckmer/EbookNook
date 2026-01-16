import { Books } from '@bindings/book'
import { EpubStructure } from '@bindings/epub'
import { PayloadAction } from '@reduxjs/toolkit'
import { actions, PayloadTypes } from '@store/reducers/books'
import { actions as uiActions } from '@store/reducers/ui'

import { selectEpubMap } from '@store/selectors/books'
import { invoke } from '@tauri-apps/api/core'
import { getDocumentLoader } from 'src/libs/document'
import { all, call, put, select, takeEvery, takeLatest } from 'typed-redux-saga'

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
  } catch (err) {
    console.log(err)
    console.log('failed to open document')
  }
}

export function* getEpubStructure(action: PayloadAction<PayloadTypes['getEpubStructure']>) {
  yield* put(uiActions.setIsFetchingStructure(true))
  const bookMap = yield* select(selectEpubMap)

  const book = bookMap[action.payload]
  if (book.toc.length > 0 && book.chapters.length > 0) {
    yield* put(uiActions.setIsFetchingStructure(false))
    return
  }

  const structure = yield* call(invoke<EpubStructure>, 'get_epub_structure_by_id', {
    id: book.book.id,
  })

  yield* put(actions.setEpubStructure({ structure, id: book.book.id }))
  yield* put(uiActions.setIsFetchingStructure(false))
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

export default function* RootSaga() {
  yield all([ImportBookSaga(), loadStateSaga(), getEpubStructureSaga()])
}
