import { IBookType as IBindingsBookType } from '@bindings/book'
import { ILocalBookType } from '@interfaces/book/interfaces'
import { BookAdapterCore } from './bookAdapterCore'

export class BookAdapter extends BookAdapterCore {
  getBookImg(book: IBindingsBookType) {
    return this._getBookImg(book)
  }

  invokeBookFormat(content: ILocalBookType) {
    return this._invokeBookFormat(content)
  }
}
