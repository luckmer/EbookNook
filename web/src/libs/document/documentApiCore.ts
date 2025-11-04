import { BookFormat } from '@interfaces/book/types'
import { getEpub } from '../epub'
import { FORMAT } from './static'
import { Chapter, IBook } from '@interfaces/book/interfaces'

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
      book = await getEpub().open(file)
    }

    if (!book) {
      throw new Error('File format not supported')
    }

    return { book, format }
  }

  async _loadBook(filePath: string): Promise<Chapter[]> {
    let book = null

    book = await getEpub().loadBook(filePath)

    if (!book) {
      throw new Error('File format not supported')
    }

    return book
  }
}

export default DocumentApiCore
