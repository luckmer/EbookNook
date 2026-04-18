import { BookAdapter } from './bookAdapter'

let _api: BookAdapter | undefined

export const getBookAdapterClient = (): BookAdapter => {
  if (_api) return _api
  _api = new BookAdapter()

  return _api
}
