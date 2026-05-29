import type { IBindingsBookmark } from '@bindings/bookmarks'
import type { PayloadAction } from '@reduxjs/toolkit'
import { actions, type PayloadTypes } from '@store/reducers/bookmarks'
import { bookmarksSelector } from '@store/selectors/bookmarks'
import { invoke } from '@tauri-apps/api/core'
import { notify } from '@utils/notification'
import { all, call, put, select, takeLatest } from 'typed-redux-saga'

export function* loadBookmarksById(id: string) {
  try {
    const bookmarks = yield* select(bookmarksSelector.bookmarks)

    if (bookmarks[id] && bookmarks[id].length > 0) {
      return
    }

    const data = yield* call(invoke<IBindingsBookmark[]>, 'get_bookmarks_by_book_id', { id })
    yield* put(actions.setBookmarks({ id, bookmarks: data }))
  } catch (err) {
    console.log('Failed to load bookmark state', err)
    notify('Failed to load bookmark state', 'error')
  }
}

export function* saveBookmark(action: PayloadAction<PayloadTypes['saveBookmark']>) {
  try {
    console.log(action.payload)
    yield* call(invoke<IBindingsBookmark>, 'add_bookmark_by_book_id', { payload: action.payload })
    yield* put(actions.setAddBookmark(action.payload))
  } catch (err) {
    console.log('Failed to save bookmark', err)
    notify('Failed to save bookmark', 'error')
  }
}

export function* deleteBookmark(action: PayloadAction<PayloadTypes['deleteBookmark']>) {
  try {
    yield* call(invoke, 'delete_bookmark_by_book_id', { id: action.payload.cfi })
    yield* put(actions.setDeleteBookmark(action.payload))
  } catch (err) {
    console.log('Failed to delete bookmark', err)
    notify('Failed to delete bookmark', 'error')
  }
}

export function* updateBookmark(action: PayloadAction<PayloadTypes['updateBookmark']>) {
  try {
    yield* call(invoke, 'update_bookmark_by_book_id', { payload: action.payload })
    yield* put(actions.setUpdateBookmark(action.payload))
  } catch (err) {
    console.log('Failed to update bookmark', err)
    notify('Failed to update bookmark', 'error')
  }
}

export function* saveBookmarkSaga() {
  yield* takeLatest(actions.saveBookmark, saveBookmark)
}

export function* deleteBookmarkSaga() {
  yield* takeLatest(actions.deleteBookmark, deleteBookmark)
}

export function* updateBookmarkSaga() {
  yield* takeLatest(actions.updateBookmark, updateBookmark)
}

export default function* RootSaga() {
  yield all([saveBookmarkSaga(), deleteBookmarkSaga(), updateBookmarkSaga()])
}
