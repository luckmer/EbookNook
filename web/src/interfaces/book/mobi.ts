import { FormatType } from '@bindings/format'
import { ILanguage, ILanguageMap } from './types'

export interface IMobiMetadata {
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

export interface IBindingsMobiToc {
  label: string
  href: string
  subitems?: Array<IBindingsMobiToc>
}

export interface IBindingsMobiSection {
  id: number
  size: number
}

export interface IMobiBookFile {
  dir?: string
  metadata: IMobiMetadata
  percentageProgress: string
  progress: Record<string, string>
  format: FormatType
  toc: Array<IBindingsMobiToc>
  sections: Array<IBindingsMobiSection>
  id: string
}

export interface IMobiBook extends IMobiBookFile {
  format: 'MOBI'
  getCover(): Promise<Blob | null>
}
