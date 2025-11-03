import { DocumentCore } from './documentCore'

let _documentLoader: DocumentCore | undefined

export const getDocumentLoader = (): DocumentCore => {
  if (_documentLoader) {
    return _documentLoader
  }

  _documentLoader = new DocumentCore()
  return _documentLoader
}
