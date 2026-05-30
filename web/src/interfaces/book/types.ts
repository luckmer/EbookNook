import type { IBindingsEpubToc } from '@bindings/epub'
import type { IEpubBook } from './epub'
import type {
  IEpubBookStructure,
  IEpubBookType,
  IMobiBookStructure,
  IMobiBookType,
  IPDFBookStructure,
  IPDFBookType,
} from './interfaces'
import type { IBindingsMobiToc, IMobiBook } from './mobi'
import type { IPDFBook } from './pdf'

export type ILanguageMap = { [key in string]?: string }
export type ILanguage = string | Array<string>
export type ILocalBookType = IEpubBook | IMobiBook | IPDFBook
export type ILocalBookToc = IBindingsEpubToc | IBindingsMobiToc
export type ITocItem = { label: string; href: string; subitems?: Array<ITocItem> }

export type IBookStructure = IEpubBookStructure | IMobiBookStructure | IPDFBookStructure
export type IBookType = IEpubBookType | IMobiBookType | IPDFBookType

export type Books = {
  EPUB: Array<IEpubBookType>
  MOBI: Array<IMobiBookType>
  PDF: Array<IPDFBookType>
}

export type IAddBookType =
  | { format: 'EPUB'; book: IEpubBookType }
  | { format: 'MOBI'; book: IMobiBookType }
  | { format: 'PDF'; book: IPDFBookType }
