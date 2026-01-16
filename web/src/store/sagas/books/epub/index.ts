import { EpubStructure } from '@bindings/epub'
import { PayloadAction } from '@reduxjs/toolkit'
import { actions, PayloadTypes } from '@store/reducers/books'
import { actions as uiActions } from '@store/reducers/ui'

import { selectEpubMap } from '@store/selectors/books'
import { invoke } from '@tauri-apps/api/core'
import { call, put, select } from 'typed-redux-saga'

export function* getEpubStructure(action: PayloadAction<PayloadTypes['getEpubStructure']>) {
  yield* put(uiActions.setIsFetchingStructure(true))
  const bookMap = yield* select(selectEpubMap)

  const book = bookMap[action.payload]

  if (!book) {
    console.log('failed to get epub structure')
    yield* put(uiActions.setIsFetchingStructure(false))
    return
  }

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

export function* updateEpubBookProgress(
  action: PayloadAction<PayloadTypes['setUpdateEpubBookProgress']>
) {
  try {
    yield* call(invoke, 'set_epub_book_progress', action.payload)
  } catch (err) {
    console.log(err)
    console.log('failed to open document')
  }
}
