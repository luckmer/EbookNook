import { IBookState } from '@interfaces/book/interfaces'
import { getEpubClient } from '../epub/client'
import { FORMAT } from './static'

class DocumentApiCore {
  isEpub(file: File): boolean {
    return file.name.endsWith(`.${FORMAT.epub}`)
  }

  async _init(file: File): Promise<IBookState> {
    let book: IBookState | null = null

    if (!file.size) {
      throw new Error('File is empty')
    }

    if (this.isEpub(file)) {
      book = await getEpubClient().init(file)
    }

    if (!book) {
      throw new Error('File format not supported')
    }

    return book
  }
}

export default DocumentApiCore
