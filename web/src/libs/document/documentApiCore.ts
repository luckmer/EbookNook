import { IBook, IToc } from '@interfaces/book/interfaces'
import { BookFormat } from '@interfaces/book/types'
import { getEpubClient } from '../epub/client'
import { FORMAT } from './static'

class DocumentApiCore {
  isEpub(file: File): boolean {
    return file.name.endsWith(`.${FORMAT.EPUB}`)
  }

  async _open(file: File): Promise<{ book: IBook; format: BookFormat }> {
    let book: IBook | null = null
    let format: BookFormat = 'EPUB'

    if (!file.size) {
      throw new Error('File is empty')
    }

    if (this.isEpub(file)) {
      format = 'EPUB'
      book = await getEpubClient().open(file)
    }

    if (!book) {
      throw new Error('File format not supported')
    }

    return { book, format }
  }

  async _loadBook(filePath: string): Promise<IToc[]> {
    let book = null

    book = await getEpubClient().loadBook(filePath)

    if (!book) {
      throw new Error('File format not supported')
    }

    return book
  }
}

export default DocumentApiCore
