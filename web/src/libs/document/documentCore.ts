import documentApiCore from './documentApiCore'

export class DocumentCore extends documentApiCore {
  constructor(file: File) {
    super(file)
  }

  load() {
    return this._load()
  }
}
