import { IBookState } from '@interfaces/book/interfaces'
import EpubClientCore from './epubClientCore'

export class EpubClient extends EpubClientCore {
  async init(file: File): Promise<IBookState> {
    return this._init(file)
  }
}
