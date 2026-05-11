import { PayloadAction } from "@reduxjs/toolkit";
import { actions, PayloadTypes } from "@store/reducers/bookmarks";
import { notify } from "@utils/notification";
import { all, takeLatest } from "typed-redux-saga";

export function* loadState() {}

export function* saveBookmark(
  action: PayloadAction<PayloadTypes["saveBookmark"]>,
) {
  try {
    console.log(action.payload);
  } catch (err) {
    console.log("Failed to save bookmark", err);
    notify("Failed to save bookmark", "error");
  }
}

export function* deleteBookmark() {
  try {
  } catch (err) {
    console.log("Failed to delete bookmark", err);
    notify("Failed to delete bookmark", "error");
  }
}

export function* updateBookmark() {
  try {
  } catch (err) {
    console.log("Failed to update bookmark", err);
    notify("Failed to update bookmark", "error");
  }
}

export function* loadStateSaga() {
  yield* takeLatest(actions.load, loadState);
}

export function* saveBookmarkSaga() {
  yield* takeLatest(actions.saveBookmark, saveBookmark);
}

export function* deleteBookmarkSaga() {
  yield* takeLatest(actions.deleteBookmark, deleteBookmark);
}

export function* updateBookmarkSaga() {
  yield* takeLatest(actions.updateBookmark, updateBookmark);
}

export default function* RootSaga() {
  yield all([
    loadStateSaga(),
    saveBookmarkSaga(),
    deleteBookmarkSaga(),
    updateBookmarkSaga(),
  ]);
}
