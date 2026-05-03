import { PDFService } from './pdfService'

let _api: PDFService | undefined

export const getPDFClient = (): PDFService => {
  if (_api) return _api
  _api = new PDFService()

  return _api
}
