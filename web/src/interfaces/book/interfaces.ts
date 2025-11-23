import { BookFormat, IProgress } from './types'
import type JSZip from 'jszip'

export interface IMetadata {
  identifier?: string
  title: string
  author: string
  language?: string[]
  description?: string
  publisher?: string
  published?: string
  modified?: string
  subject?: string[]
  rights?: string
  cover?: string
  series?: { name: string; position?: number } | null
}

export interface IResolveHref {
  page: number
  anchor?: (doc: Document) => Element | null
}

export interface Chapter {
  id: string
  href: string
  index: number
  content: string
}

export interface IToc {
  id: string
  href: string
  label: string
  parent?: string | null
  subitems: IToc[]
}

export interface IBook {
  url?: string
  hash: string
  rootFilePath: string
  format: BookFormat
  title: string
  sourceTitle?: string
  author: string
  group?: string
  groupId?: string
  groupName?: string
  tags?: string[]
  coverImageUrl?: string | null
  createdAt: number
  updatedAt: number
  deletedAt?: number | null
  uploadedAt?: number | null
  downloadedAt?: number | null
  coverDownloadedAt?: number | null
  lastUpdated?: number
  progress: IProgress
  primaryLanguage?: string
  metadata: IMetadata
}

export interface IXML {
  rootFilePath: string
  basePath: string
  filePath: string
  doc: Document
  zip: JSZip
}
