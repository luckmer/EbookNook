import { FormatType } from '@bindings/format'

export interface IBookFile {
  percentageProgress: string
  format: FormatType
  cover: string
  title: string
  author: string
  id: string
}
