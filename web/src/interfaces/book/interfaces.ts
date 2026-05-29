import type { IBindingsEpubBook, IBindingsEpubBookStructure } from '@bindings/epub'
import type { FormatType } from '@bindings/format'
import type { IBindingsMobiBook, IBindingsMobiBookStructure } from '@bindings/mobi'
import type { IBindingsPDFBook, IBindingsPDFBookStructure } from '@bindings/pdf'
export interface IBookFile {
  percentageProgress: string
  format: FormatType
  cover: string
  title: string
  author: string
  id: string
}

export interface IEpubBookStructure extends IBindingsEpubBookStructure {
  format: 'EPUB'
}

export interface IMobiBookStructure extends IBindingsMobiBookStructure {
  format: 'MOBI'
}

export interface IPDFBookStructure extends IBindingsPDFBookStructure {
  format: 'PDF'
}

export interface IEpubBookType extends IBindingsEpubBook {
  format: 'EPUB'
}

export interface IMobiBookType extends IBindingsMobiBook {
  format: 'MOBI'
}

export interface IPDFBookType extends IBindingsPDFBook {
  format: 'PDF'
}
