import type { FormatType } from '@bindings/format'
import type { ILanguage, ILanguageMap } from './types'

export interface IFB2Metadata {
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
  subject?: string | string[] | ILanguageMap
}

export interface IFB2Toc {
  label: string
  href: string
  subitems?: Array<IFB2Toc>
}

export interface IFB2Section {
  id: number
  size: number
}

export interface IFB2BookFile {
  dir?: string
  metadata: IFB2Metadata
  percentageProgress: string
  progress: Record<string, string>
  format: FormatType
  toc: Array<IFB2Toc>
  sections: Array<IFB2Section>
  id: string
}

export interface IFB2Book extends IFB2BookFile {
  format: 'FB2'
  getCover(): Promise<Blob | null>
}
