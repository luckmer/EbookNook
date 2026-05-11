import { all } from 'typed-redux-saga'
import bookmarksRoot from './bookmarks'
import booksRoot from './books'

export default function* RootSaga() {
  yield all([booksRoot(), bookmarksRoot()])
}
