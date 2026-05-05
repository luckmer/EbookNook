import { IEpubBookType, IMobiBookType, IPDFBookType } from '@interfaces/book/interfaces'
import { IAddBookType, ILanguageMap, ILocalBookType, ITocItem } from '@interfaces/book/types'
import { getAppClient } from '@libs/appService'
import { convertFileSrc } from '@tauri-apps/api/core'

export class BookAdapterCore {
  _getContent(content: string | string[] | ILanguageMap): string {
    if (!content) return '--'

    if (typeof content === 'string') return content

    if (Array.isArray(content)) {
      const first = content[0]
      if (!first) return '--'
      return (typeof first === 'object' ? first['name'] : first) ?? '--'
    }

    return content['name'] ?? '--'
  }

  _formatToc(toc: ITocItem[]): ITocItem[] {
    if (!toc) return []
    return toc.map((item) => ({
      label: item.label ?? '',
      href: item.href ?? '',
      subitems: this._formatToc(item.subitems ?? []),
    }))
  }

  async _invokeBookFormat(content: ILocalBookType): Promise<IAddBookType> {
    switch (content.format) {
      case 'EPUB': {
        const epubFormat: IEpubBookType = {
          createdAt: Date.now().toString(),
          updatedAt: Date.now().toString(),
          percentageProgress: content.percentageProgress,
          metadata: {
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
            editor: content.metadata.editor,
            subject: content.metadata.subject
              ? this._getContent(content.metadata.subject)
              : undefined,
            isbn: content.metadata.isbn,
            subtitle: content.metadata.subtitle,
            series: content.metadata.series,
            seriesIndex: content.metadata.seriesIndex,
            seriesTotal: content.metadata.seriesTotal,
          },
          rendition: content.rendition,
          progress: content.progress,
          sections: content.sections,
          format: content.format,
          toc: this._formatToc(content.toc),
          id: content.id,
        }

        return {
          book: epubFormat,
          format: 'EPUB',
        }
      }
      case 'MOBI': {
        const mobiFormat: IMobiBookType = {
          createdAt: Date.now().toString(),
          updatedAt: Date.now().toString(),
          id: content.id,
          format: content.format,
          percentageProgress: content.percentageProgress,
          progress: content.progress,
          metadata: {
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
          sections: content.sections,
          toc: this._formatToc(content.toc),
        }

        return {
          book: mobiFormat,
          format: 'MOBI',
        }
      }
      case 'PDF': {
        const pdfFormat: IPDFBookType = {
          createdAt: Date.now().toString(),
          updatedAt: Date.now().toString(),
          id: content.id,
          format: content.format,
          percentageProgress: content.percentageProgress,
          progress: content.progress,
          sections: content.sections,
          toc: this._formatToc(content.toc ?? []),
          metadata: {
            author: this._getContent(content.metadata.author ?? 'Unknown Author'),
            title: this._getContent(content.metadata.title ?? 'Unknown Title'),
            contributor: content.metadata.contributor,
            description: content.metadata.description,
            identifier: content.metadata.identifier,
            language: content.metadata.language,
            cover: '',
            publisher: content.metadata.publisher,
            rights: content.metadata.rights,
            subject: content.metadata.subject
              ? this._getContent(content.metadata.subject)
              : undefined,
          },
        }

        return {
          book: pdfFormat,
          format: 'PDF',
        }
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
