import EpubApiClientProvider from './epubApiCore'

export class EpubCore extends EpubApiClientProvider {
  constructor(file: File) {
    super(file)
  }

  loadFile() {
    return this._loadFile()
  }
}
