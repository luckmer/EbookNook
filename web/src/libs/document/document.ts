import DocumentClientCore from './documentCore'

export class DocumentClient extends DocumentClientCore {
  async init(file: File) {
    return this._init(file)
  }
}
