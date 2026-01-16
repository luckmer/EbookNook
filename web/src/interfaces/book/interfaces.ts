import { Epub } from '@bindings/epub'

import type JSZip from 'jszip'
export interface IXML {
  basePath: string
  doc: Document
  zip: JSZip
}

export type IBookState = Epub
