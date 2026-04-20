import { FormatType } from '@bindings/format'
import { IEpubBook } from './epub'
import { IMobiBook } from './mobi'

export type ILocalBookType = IEpubBook | IMobiBook

export type ITocItem = { label: string; href: string; subitems?: Array<ITocItem> }

export interface IBookFile {
  percentageProgress: string
  format: FormatType
  cover: string
  title: string
  id: string
}
