import { BookFormat } from '@interfaces/book/types'
import { getEpub } from '../epub'
import { FORMAT } from './static'

class DocumentApiCore {
  file: File

  constructor(file: File) {
    this.file = file
  }

  isEpub(file: File) {
    return file.name.endsWith(`.${FORMAT.EPUB}`)
  }

  _load() {
    let book = null
    let format: BookFormat = 'EPUB'

    if (!this.file.size) {
      throw new Error('File is empty')
    }

    console.log(this.isEpub(this.file))
    if (this.isEpub(this.file)) {
      format = 'EPUB'
      book = getEpub(this.file).loadFile()
    }

    return { book, format }
  }
}

export default DocumentApiCore
