import { PDFServiceCore } from './pdfServiceCore'

export class PDFService extends PDFServiceCore {
  init(file: File) {
    return this._init(file)
  }
}
