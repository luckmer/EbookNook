import { Chapter, IBook } from '@interfaces/book/interfaces'
import EpubApiClientProvider from './epubApiCore'

export class EpubCore extends EpubApiClientProvider {
  async open(file: File): Promise<IBook> {
    return this._open(file)
  }
  async loadBook(filePath: string): Promise<Chapter[]> {
    return this._loadBook(filePath)
  }
}
