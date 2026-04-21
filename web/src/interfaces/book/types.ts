import { IBindingsEpubToc } from '@bindings/epub'
import { IBindingsMobiToc } from '@bindings/mobi'
import { IEpubBook } from './epub'
import { IMobiBook } from './mobi'

export type ILanguageMap = { [key in string]?: string }
export type ILanguage = string | Array<string>
export type ILocalBookType = IEpubBook | IMobiBook
export type ILocalBookToc = IBindingsEpubToc | IBindingsMobiToc
export type ITocItem = { label: string; href: string; subitems?: Array<ITocItem> }
