import { IBindingsEpubRendition, IBindingsEpubSection, IBindingsEpubToc } from '@bindings/epub'
import { FormatType } from '@bindings/format'
import { ILanguage, ILanguageMap } from './types'

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
  progress: Record<string, string>
  format: FormatType
  toc: Array<IBindingsEpubToc>
  sections: Array<IBindingsEpubSection>
  id: string
}

export interface IEpubBook extends IEpubBookFile {
  format: 'EPUB'
  getCover(): Promise<Blob | null>
}
