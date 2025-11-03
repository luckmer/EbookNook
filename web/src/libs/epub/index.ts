import { EpubCore } from './epubCore'

let _api: EpubCore | undefined

export const getEpub = (): EpubCore => {
  if (_api) return _api
  _api = new EpubCore()

  return _api
}
