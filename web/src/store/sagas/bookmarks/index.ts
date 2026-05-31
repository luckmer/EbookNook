import type { IBindingsBookmark } from '@bindings/bookmarks'
import { LOADER_STATE, LOADER_STATUS } from '@interfaces/ui/enums'
import type { PayloadAction } from '@reduxjs/toolkit'
import { actions, defaultSelectedBookmark, type PayloadTypes } from '@store/reducers/bookmarks'
import { actions as uiActions } from '@store/reducers/ui'
import { bookmarksSelector } from '@store/selectors/bookmarks'
import { invoke } from '@tauri-apps/api/core'
import { notify } from '@utils/notification'
import { all, call, put, select, takeEvery } from 'typed-redux-saga'

export function* loadBookmarksByBookId(id: string) {
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

export function* addBookmarkById(action: PayloadAction<PayloadTypes['addBookmarkById']>) {
  yield* put(
    uiActions.setScopedLoaderState({
      scope: action.payload.bookId,
      loader: LOADER_STATE.IS_ADDING_BOOKMARK,
      state: { status: LOADER_STATUS.LOADING },
    }),
  )

  try {
    yield* call(invoke<IBindingsBookmark>, 'add_bookmark_by_book_id', { payload: action.payload })

    yield* put(actions.setAddBookmark(action.payload))
  } catch (err) {
    console.log('Failed to save bookmark', err)
    notify('Failed to save bookmark', 'error')
  }

  yield* put(
    uiActions.setScopedLoaderState({
      scope: action.payload.bookId,
      loader: LOADER_STATE.IS_ADDING_BOOKMARK,
      state: { status: LOADER_STATUS.IDLE },
    }),
  )
}

export function* deleteBookmark(action: PayloadAction<PayloadTypes['deleteBookmark']>) {
  yield* put(
    uiActions.setScopedLoaderState({
      scope: action.payload.id,
      loader: LOADER_STATE.IS_DELETING_BOOKMARK,
      state: { status: LOADER_STATUS.LOADING },
    }),
  )

  try {
    yield* call(invoke, 'delete_bookmark_by_book_id', {
      id: action.payload.id,
      cfi: action.payload.cfi,
    })
    yield* put(actions.setDeleteBookmark(action.payload))

    const activeBookmark = yield* select(bookmarksSelector.selectedBookmark)

    if (activeBookmark.cfi === action.payload.cfi) {
      yield* put(actions.setSelectedBookmark(defaultSelectedBookmark))
    }
  } catch (err) {
    console.log('Failed to delete bookmark', err)
    notify('Failed to delete bookmark', 'error')
  }

  yield* put(
    uiActions.setScopedLoaderState({
      scope: action.payload.id,
      loader: LOADER_STATE.IS_DELETING_BOOKMARK,
      state: { status: LOADER_STATUS.IDLE },
    }),
  )
}

export function* updateBookmark(action: PayloadAction<PayloadTypes['updateBookmark']>) {
  yield* put(
    uiActions.setScopedLoaderState({
      scope: action.payload.bookId,
      loader: LOADER_STATE.IS_UPDATING_BOOKMARK,
      state: { status: LOADER_STATUS.LOADING },
    }),
  )

  try {
    yield* call(invoke, 'update_bookmark_by_book_id', { payload: action.payload })
    yield* put(actions.setUpdateBookmark(action.payload))
  } catch (err) {
    console.log('Failed to update bookmark', err)
    notify('Failed to update bookmark', 'error')
  }

  yield* put(
    uiActions.setScopedLoaderState({
      scope: action.payload.bookId,
      loader: LOADER_STATE.IS_UPDATING_BOOKMARK,
      state: { status: LOADER_STATUS.IDLE },
    }),
  )
}

export function* addBookmarkByIdSaga() {
  yield* takeEvery(actions.addBookmarkById, addBookmarkById)
}

export function* deleteBookmarkSaga() {
  yield* takeEvery(actions.deleteBookmark, deleteBookmark)
}

export function* updateBookmarkSaga() {
  yield* takeEvery(actions.updateBookmark, updateBookmark)
}

export default function* RootSaga() {
  yield all([addBookmarkByIdSaga(), deleteBookmarkSaga(), updateBookmarkSaga()])
}
