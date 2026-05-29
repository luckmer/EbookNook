import type { PayloadAction } from '@reduxjs/toolkit'
import { actions as bookmarkActions } from '@store/reducers/bookmarks'
import { actions, type PayloadTypes } from '@store/reducers/books'
import { actions as readerActions } from '@store/reducers/reader'
import { all, call, put, takeLatest } from 'typed-redux-saga'
import { loadBookmarksById } from '../bookmarks'
import { setOpenBook } from '../books'

export function* resetBookState() {
  yield* all([put(bookmarkActions.reset()), put(readerActions.reset())])
}

export function* loadBookmarkState(action: PayloadAction<PayloadTypes['setOpenBook']>) {
  yield* call(loadBookmarksById, action.payload)
}

export function* setGetBookmarksSaga() {
  yield* takeLatest(actions.setOpenBook, loadBookmarkState)
}

export function* setOpenBookSaga() {
  yield* takeLatest(actions.setOpenBook, setOpenBook)
}

export function* resetBookStateSaga() {
  yield* takeLatest(actions.setOpenBook, resetBookState)
}

export default function* RootSaga() {
  yield all([setOpenBookSaga(), setGetBookmarksSaga(), resetBookStateSaga()])
}
