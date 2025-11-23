import { IBook, IToc } from '@interfaces/book/interfaces'
import EpubClientCore from './epubClientCore'

export class EpubClient extends EpubClientCore {
  async open(file: File): Promise<IBook> {
    return this._open(file)
  }
  async loadBook(filePath: string): Promise<IToc[]> {
    return this._loadBook(filePath)
  }
}
