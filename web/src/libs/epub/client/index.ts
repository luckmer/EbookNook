import { EpubClient } from './epubClient'

let _api: EpubClient | undefined

export const getEpubClient = (): EpubClient => {
  if (_api) return _api
  _api = new EpubClient()

  return _api
}
