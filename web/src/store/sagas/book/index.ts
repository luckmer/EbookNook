import { PayloadAction } from '@reduxjs/toolkit'
import { actions, PayloadTypes } from '@store/reducers/books'
import { all, call, takeLatest } from 'typed-redux-saga'
import { loadBookmarksById } from '../bookmarks'
import { setOpenBook } from '../books'

export function* loadBookmarkState(action: PayloadAction<PayloadTypes['setOpenBook']>) {
  yield* call(loadBookmarksById, action.payload)
}

export function* setGetBookmarksSaga() {
  yield* takeLatest(actions.setOpenBook, loadBookmarkState)
}

export function* setOpenBookSaga() {
  yield* takeLatest(actions.setOpenBook, setOpenBook)
}

export default function* RootSaga() {
  yield all([setOpenBookSaga(), setGetBookmarksSaga()])
}
