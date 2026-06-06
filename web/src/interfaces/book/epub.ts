import type { FormatType } from '@bindings/format'
import type { ILanguage, ILanguageMap } from './types'

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

export type IToc = { label: string; href: string; subitems?: Array<IToc> }

export type ISection = {
  id: string
  cfi: string
  size: number
  linear?: string
  pageSpread?: ISpread
}

export type ILayout = 'pre-paginated' | 'reflowable'
export type ISpread = 'left' | 'right' | 'center' | ''
export type IViewPort = { width: number; height: number }

export type IRendition = {
  layout?: ILayout
  spread?: ISpread
  viewport?: IViewPort
}

export interface IEpubBookFile {
  dir?: string
  metadata: IEpubMetadata
  rendition: IRendition
  percentageProgress: string
  progress: Record<string, string>
  format: FormatType
  toc: Array<IToc>
  sections: Array<ISection>
  id: string
}

export interface IEpubBook extends IEpubBookFile {
  format: 'EPUB'
  getCover(): Promise<Blob | null>
}
