import { LOADER_STATE, LOADER_STATUS } from '@interfaces/ui/enums'
import type { PayloadAction } from '@reduxjs/toolkit'
import { actions as bookmarkActions } from '@store/reducers/bookmarks'
import { actions, type PayloadTypes } from '@store/reducers/books'
import { actions as noteActions } from '@store/reducers/notes'
import { actions as readerActions } from '@store/reducers/reader'
import { actions as uiActions } from '@store/reducers/ui'
import { all, call, put, takeLatest } from 'typed-redux-saga'
import { loadBookmarksByBookId } from '../bookmarks'
import { getBookStructure, setOpenBook } from '../books'
import { getNotesByBookId } from '../notes'

export function* resetBookState() {
  yield* all([put(bookmarkActions.reset()), put(readerActions.reset()), put(noteActions.reset())])
}

export function* loadAnnotationState(action: PayloadAction<PayloadTypes['setOpenBook']>) {
  yield* put(
    uiActions.setLoaderState({
      loader: LOADER_STATE.IS_LOADING_ANNOTATIONS,
      state: { status: LOADER_STATUS.LOADING },
    }),
  )

  yield* all([
    call(loadBookmarksByBookId, action.payload.id),
    call(getNotesByBookId, action.payload.id),
  ])

  yield* put(
    uiActions.setLoaderState({
      loader: LOADER_STATE.IS_LOADING_ANNOTATIONS,
      state: { status: LOADER_STATUS.IDLE },
    }),
  )
}

export function* loadBookStructure(action: PayloadAction<PayloadTypes['setOpenBook']>) {
  yield* put(
    uiActions.setLoaderState({
      loader: LOADER_STATE.IS_FETCHING_STRUCTURE,
      state: { status: LOADER_STATUS.LOADING },
    }),
  )

  yield* all([call(setOpenBook, action.payload.id), call(getBookStructure, action.payload.id)])

  yield* put(
    uiActions.setLoaderState({
      loader: LOADER_STATE.IS_FETCHING_STRUCTURE,
      state: { status: LOADER_STATUS.IDLE },
    }),
  )
}

export function* setGetBookmarksSaga() {
  yield* takeLatest(actions.setOpenBook, loadAnnotationState)
}

export function* setOpenBookSaga() {
  yield* takeLatest(actions.setOpenBook, loadBookStructure)
}

export function* resetBookStateSaga() {
  yield* takeLatest(actions.setOpenBook, resetBookState)
}

export default function* RootSaga() {
  yield all([setOpenBookSaga(), setGetBookmarksSaga(), resetBookStateSaga()])
}
