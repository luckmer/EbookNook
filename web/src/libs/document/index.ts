import { DocumentClient } from './document'

let _api: DocumentClient | undefined

export const getDocumentClient = (): DocumentClient => {
  if (_api) return _api
  _api = new DocumentClient()

  return _api
}
