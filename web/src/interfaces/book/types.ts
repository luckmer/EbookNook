import type { IEpubBook } from './epub'
import type { IMobiBook } from './mobi'
import type { IPDFBook } from './pdf'

export type ILanguageMap = { [key in string]?: string }
export type ILanguage = string | Array<string>
export type ITocItem = { label: string; href: string; subitems?: Array<ITocItem> }
export type ILocalBookType = IEpubBook | IMobiBook | IPDFBook
