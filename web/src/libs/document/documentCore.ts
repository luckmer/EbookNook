import documentApiCore from './documentApiCore'

export class DocumentCore extends documentApiCore {
  constructor(file: File) {
    super(file)
  }

  open() {
    return this._open()
  }
}
