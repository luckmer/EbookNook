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

  async _open() {
    let book = null
    let format: BookFormat = 'EPUB'

    if (!this.file.size) {
      throw new Error('File is empty')
    }

    // if (this.isEpub(this.file)) {
    format = 'EPUB'
    book = await getEpub(this.file).open()
    // }

    return { book, format }
  }
}

export default DocumentApiCore
