import { all } from 'typed-redux-saga'
import booksRoot from './books'

export default function* RootSaga() {
  yield all([booksRoot()])
}
