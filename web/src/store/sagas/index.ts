import { all } from 'typed-redux-saga'
import bookRoot from './book'
import bookmarksRoot from './bookmarks'
import booksRoot from './books'

export default function* RootSaga() {
  yield all([booksRoot(), bookmarksRoot(), bookRoot()])
}
