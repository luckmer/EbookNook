import EpubApiClientProvider from './epubApiCore'

export class EpubCore extends EpubApiClientProvider {
  constructor(file: File) {
    super(file)
  }

  async open() {
    return this._open()
  }
}
