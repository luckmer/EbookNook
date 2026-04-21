import { AppServiceCore } from './appServiceCore'

export class AppService extends AppServiceCore {
  async saveBookToStorage(file: File, bookId: string): Promise<string> {
    return this._saveBookToStorage(file, bookId)
  }

  async loadBookFromStorage(bookId: string): Promise<File> {
    return this._loadBookFromStorage(bookId)
  }

  async getCover(bookId: string) {
    return this._getCover(bookId)
  }
}
