import { AppServiceCore } from './appServiceCore'

export class AppService extends AppServiceCore {
  saveBookToStorage(file: File, bookId: string): Promise<string> {
    return this._saveBookToStorage(file, bookId)
  }

  loadBookFromStorage(bookId: string): Promise<File> {
    return this._loadBookFromStorage(bookId)
  }
}
