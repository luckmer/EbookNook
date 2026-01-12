import { Epub } from '@bindings/epub'
import { BookFormat } from './enums'

import type JSZip from 'jszip'
export interface IXML {
  rootFilePath: string
  basePath: string
  filePath: string
  doc: Document
  zip: JSZip
}

export interface IEpub extends Epub {
  format: BookFormat.EPUB
}

export type IBookState = IEpub
