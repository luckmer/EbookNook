import { BookFormat } from './types'

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

export interface IBook {
  url?: string
  filePath?: string
  hash: string
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
  progress?: [number, number]
  primaryLanguage?: string
  metadata: IMetadata
}
