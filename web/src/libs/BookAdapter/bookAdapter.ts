import { ILocalBookType } from '@interfaces/book/types'
import { BookAdapterCore } from './bookAdapterCore'

export class BookAdapter extends BookAdapterCore {
  getBookImg(id: string) {
    return this._getBookImg(id)
  }

  invokeBookFormat(content: ILocalBookType) {
    return this._invokeBookFormat(content)
  }
}
