import { all } from 'typed-redux-saga'
import bookRoot from './book'
import bookmarksRoot from './bookmarks'
import booksRoot from './books'
import notesRoot from './notes'

export default function* RootSaga() {
  yield all([booksRoot(), bookmarksRoot(), bookRoot(), notesRoot()])
}
