import { BookFormat } from '@interfaces/book/types'
import documentApiCore from './documentApiCore'
import { IBook } from '@interfaces/book/interfaces'

export class DocumentCore extends documentApiCore {
  open(file: File): Promise<{ book: IBook; format: BookFormat }> {
    return this._open(file)
  }

  loadBook(filePath: string) {
    return this._loadBook(filePath)
  }
}
