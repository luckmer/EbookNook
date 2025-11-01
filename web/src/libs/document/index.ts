import { DocumentCore } from './documentCore'

let _documentLoader: DocumentCore | undefined
let _fileSignature: string | undefined

export const getDocumentLoader = (file: File): DocumentCore => {
  const fileSignature = `${file.name}_${file.size}_${file.lastModified}`

  if (fileSignature === _fileSignature && _documentLoader) {
    return _documentLoader
  }

  _documentLoader = new DocumentCore(file)
  _fileSignature = fileSignature

  return _documentLoader
}
