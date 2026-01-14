import { Epub } from '@bindings/epub'

import type JSZip from 'jszip'
export interface IXML {
  rootFilePath: string
  basePath: string
  filePath: string
  doc: Document
  zip: JSZip
}

export type IBookState = Epub
