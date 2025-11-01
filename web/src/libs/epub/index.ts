import { EpubCore } from './epubCore'

let _api: EpubCore | undefined
let _fileSignature: string | undefined

export const getEpub = (file: File): EpubCore => {
  const fileSignature = `${file.name}_${file.size}_${file.lastModified}`

  if (_fileSignature === fileSignature && _api) {
    return _api
  }

  _api = new EpubCore(file)
  _fileSignature = fileSignature

  return _api
}
