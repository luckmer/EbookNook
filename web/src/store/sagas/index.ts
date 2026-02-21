import { all } from 'typed-redux-saga'
import annotationsRoot from './annotations'
import booksRoot from './books'

export default function* RootSaga() {
  yield all([booksRoot(), annotationsRoot()])
}
