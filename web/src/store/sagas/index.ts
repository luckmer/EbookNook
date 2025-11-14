import { all } from 'typed-redux-saga'
import BooksRoot from './books'

export default function* RootSaga() {
  yield all([BooksRoot()])
}
