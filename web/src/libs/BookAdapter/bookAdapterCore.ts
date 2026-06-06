import type { IBindingsBook } from '@bindings/book'
import type { IBindingsSection, IBindingsSectionStruct } from '@bindings/sections'
import type { IBindingsToc, IBindingsTocStructure } from '@bindings/toc'
import type { ILanguageMap, ILocalBookType, ITocItem } from '@interfaces/book/types'
import { getAppClient } from '@libs/appService'
import { convertFileSrc } from '@tauri-apps/api/core'

export class BookAdapterCore {
  _getContent(content: string | string[] | ILanguageMap): string {
    if (!content) return '--'

    if (typeof content === 'string') return content

    if (Array.isArray(content)) {
      const first = content[0]

      if (!first) return '--'
      //@ts-expect-error name is optional
      return typeof first === 'string' ? first : (first.name ?? '--')
    }

    return content.name ?? '--'
  }

  _getTocState(toc: ITocItem[]): Array<IBindingsTocStructure> {
    if (!toc) return []

    return toc.map((item) => ({
      label: item.label ?? '',
      href: item.href ?? '',
      subitems: this._getTocState(item.subitems ?? []),
    }))
  }

  _getSectionState(
    sections: { id: string | number; size: number }[],
  ): Array<IBindingsSectionStruct> {
    return sections.map((item) => ({
      id: item.id.toString(),
      size: item.size.toString(),
    }))
  }

  _formatToc(toc: ITocItem[], id: string): IBindingsToc {
    if (!toc)
      return {
        id,
        toc: [],
      }

    return {
      id,
      toc: this._getTocState(toc),
    }
  }

  _formatSections(
    sections: Array<{ id: string | number; size: number }>,
    id: string,
  ): IBindingsSection {
    return {
      id,
      sections: this._getSectionState(sections),
    }
  }

  async _invokeBookFormat(content: ILocalBookType): Promise<IBindingsBook> {
    switch (content.format) {
      case 'EPUB': {
        const book: IBindingsBook = {
          createdAt: Date.now().toString(),
          updatedAt: Date.now().toString(),
          percentageProgress: content.percentageProgress,
          metadata: {
            id: content.id,
            format: 'EPUB',
            author: this._getContent(content.metadata.author),
            title: this._getContent(content.metadata.title),
            contributor: content.metadata.contributor
              ? this._getContent(content.metadata.contributor)
              : undefined,
            description: content.metadata.description,
            identifier: content.metadata.identifier,
            language: content.metadata.language,
            cover: '',
            publisher: content.metadata.publisher,
            published: content.metadata.published,
            modified: content.metadata.modified,
            rights: content.metadata.rights,
            subject: content.metadata.subject
              ? this._getContent(content.metadata.subject)
              : undefined,
          },
          progress: content.progress,
          sections: this._formatSections(content.sections, content.id),
          format: content.format,
          toc: this._formatToc(content.toc, content.id),
          id: content.id,
        }

        return book
      }
      case 'MOBI': {
        const book: IBindingsBook = {
          createdAt: Date.now().toString(),
          updatedAt: Date.now().toString(),
          id: content.id,
          format: content.format,
          percentageProgress: content.percentageProgress,
          progress: content.progress,
          metadata: {
            id: content.id,
            format: 'MOBI',
            author: this._getContent(content.metadata.author),
            title: this._getContent(content.metadata.title),
            contributor: content.metadata.contributor
              ? this._getContent(content.metadata.contributor)
              : undefined,
            description: content.metadata.description,
            identifier: content.metadata.identifier,
            language: content.metadata.language,
            cover: '',
            publisher: content.metadata.publisher,
            published: content.metadata.published,
            modified: content.metadata.modified,
            rights: content.metadata.rights,
            subject: content.metadata.subject
              ? this._getContent(content.metadata.subject)
              : undefined,
          },
          sections: this._formatSections(content.sections, content.id),
          toc: this._formatToc(content.toc, content.id),
        }

        return book
      }
      case 'PDF': {
        const book: IBindingsBook = {
          createdAt: Date.now().toString(),
          updatedAt: Date.now().toString(),
          id: content.id,
          format: content.format,
          percentageProgress: content.percentageProgress,
          progress: content.progress,
          sections: this._formatSections(content.sections, content.id),
          toc: this._formatToc(content.toc ?? [], content.id),
          metadata: {
            id: content.id,
            format: 'PDF',
            author: this._getContent(content.metadata.author ?? 'Unknown Author'),
            title: this._getContent(content.metadata.title ?? 'Unknown Title'),
            contributor: content.metadata.contributor
              ? this._getContent(content.metadata.contributor)
              : undefined,
            description: content.metadata.description,
            identifier: content.metadata.identifier,
            language: content.metadata.language ?? 'Unknown Language',
            cover: '',
            publisher: content.metadata.publisher,
            published: 'Unknown Date',
            modified: 'Unkown Date',
            rights: content.metadata.rights,
            subject: content.metadata.subject
              ? this._getContent(content.metadata.subject)
              : undefined,
          },
        }

        return book
      }
      default: {
        throw new Error('format not implemented')
      }
    }
  }

  async _getBookImg(id: string): Promise<string> {
    const appService = getAppClient()

    const cover = await appService.getCover(id)

    return convertFileSrc(cover)
  }
}
