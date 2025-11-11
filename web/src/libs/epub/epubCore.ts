import { Chapter, IBook, IToc } from '@interfaces/book/interfaces'
import EpubApiClientProvider from './epubApiCore'

export class EpubCore extends EpubApiClientProvider {
  async open(file: File): Promise<IBook> {
    return this._open(file)
  }
  async loadBook(filePath: string): Promise<{ chapters: Chapter[]; toc: IToc[] }> {
    return this._loadBook(filePath)
  }
}
