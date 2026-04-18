import { IBookFile } from '@bindings/book'
import { IBook } from '@interfaces/book/interfaces'
import { BookAdapterCore } from './bookAdapterCore'

export class BookAdapter extends BookAdapterCore {
  getBookFormat(content: IBook): Promise<IBookFile> {
    return this._getBookFormat(content)
  }

  getBookImg(book: IBookFile) {
    return this._getBookImg(book)
  }

  invokeBookFormat(content: IBook): Promise<IBookFile> {
    return this._invokeBookFormat(content)
  }
}
