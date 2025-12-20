import { IBookState } from '@interfaces/book/interfaces'
import documentApiCore from './documentApiCore'

export class DocumentCore extends documentApiCore {
  init(file: File): Promise<IBookState> {
    return this._init(file)
  }
}
