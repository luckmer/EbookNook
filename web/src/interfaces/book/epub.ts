import {
  IBindingsEpubBookStructure,
  IBindingsEpubRendition,
  IBindingsEpubSection,
  IBindingsEpubToc,
} from '@bindings/epub'
import { FormatType } from '@bindings/format'

export type ILanguageMap = { [key in string]?: string }
export type ILanguage = string | Array<string>

export interface IEpubMetadata {
  author: string | string[] | ILanguageMap
  title: string | string[] | ILanguageMap
  contributor?: string | string[] | ILanguageMap
  description?: string
  identifier: string
  language: ILanguage
  cover: string
  publisher?: string
  published?: string
  modified?: string
  rights?: string
  editor?: string
  subject?: string | string[] | ILanguageMap
  isbn?: string
  subtitle?: string
  series?: string
  seriesIndex?: number
  seriesTotal?: number
}

export interface IEpubBookFile {
  dir?: string
  metadata: IEpubMetadata
  rendition: IBindingsEpubRendition
  percentageProgress: string
  progress: Array<string>
  format: FormatType
  toc: Array<IBindingsEpubToc>
  sections: Array<IBindingsEpubSection>
  id: string
}

export interface IEpubBook extends IEpubBookFile {
  getCover(): Promise<Blob | null>
}

export type IBookStructure = IBindingsEpubBookStructure
