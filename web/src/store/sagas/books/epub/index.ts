import { Epub, EpubStructure } from '@bindings/epub'
import { BOOK_STATUS } from '@interfaces/book/enums'
import { PayloadAction } from '@reduxjs/toolkit'
import { actions, PayloadTypes } from '@store/reducers/books'
import { actions as uiActions } from '@store/reducers/ui'
import { selectEpubMap } from '@store/selectors/books'
import { invoke } from '@tauri-apps/api/core'
import { notify } from '@utils/notification'
import { all, call, put, select } from 'typed-redux-saga'

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
  action: PayloadAction<PayloadTypes['setUpdateEpubBookProgress']>,
) {
  try {
    yield* call(invoke, 'set_epub_book_progress', action.payload)
  } catch (err) {
    console.log(err)
    console.log('failed to update epub book progress')
    notify('Failed to update epub book progress', 'error')
  }
}

export function* deleteEpubBook(action: PayloadAction<PayloadTypes['setDeleteEpub']>) {
  try {
    yield* put(actions.setStatus({ id: action.payload, status: BOOK_STATUS.DELETING }))
    yield* call(invoke, 'delete_epub_book', { id: action.payload })

    yield* all([
      put(actions.setStatus({ id: action.payload, status: BOOK_STATUS.SUCCESS })),
      put(actions.deleteEpub(action.payload)),
    ])
  } catch (err) {
    console.log(err)
    console.log('failed to remove epub')
    yield* put(actions.setStatus({ id: action.payload, status: BOOK_STATUS.ERROR }))
    notify('Failed to remove epub', 'error')
  }
}

export function* editEpubBook(action: PayloadAction<PayloadTypes['setEditEpub']>) {
  try {
    yield* put(actions.setStatus({ id: action.payload.id, status: BOOK_STATUS.UPDATING }))
    const response = yield* call(invoke<Epub>, 'edit_epub_book', {
      id: action.payload.id,
      content: action.payload.content,
    })

    yield* all([
      put(actions.setStatus({ id: action.payload.id, status: BOOK_STATUS.SUCCESS })),
      put(actions.updateEpubBook(response.book)),
    ])
  } catch (err) {
    yield* put(actions.setStatus({ id: action.payload.id, status: BOOK_STATUS.ERROR }))
    console.log(err)
    console.log('failed to edit epub')
    notify('Failed to edit epub', 'error')
  }
}
