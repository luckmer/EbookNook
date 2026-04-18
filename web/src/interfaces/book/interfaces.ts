import { IBookDocSectionItem, IBookFile } from '@bindings/book'

export interface ISection extends IBookDocSectionItem {
  createDocument: () => Promise<Document>
}

export interface IBook extends IBookFile {
  transformTarget?: EventTarget
  splitTOCHref(href: string): Array<string | number>
  getCover(): Promise<Blob | null>
}
