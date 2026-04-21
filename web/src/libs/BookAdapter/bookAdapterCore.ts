import { IBookType as IBindingsBookType } from '@bindings/book'
import { IBindingsEpubBook } from '@bindings/epub'
import { IBindingsMobiBook } from '@bindings/mobi'
import { ILanguageMap, ILocalBookType } from '@interfaces/book/types'
import { getAppClient } from '@libs/appService'
import { convertFileSrc } from '@tauri-apps/api/core'

export class BookAdapterCore {
  _getContent(content: string | string[] | ILanguageMap): string {
    if (!content) {
      return '--'
    }

    if (typeof content === 'string') {
      return content
    }

    if (Array.isArray(content)) {
      return content[0]
    }

    return content['name'] ?? '--'
  }

  async _invokeBookFormat(content: ILocalBookType): Promise<IBindingsBookType> {
    switch (content.format) {
      case 'EPUB': {
        const epubFormat: IBindingsEpubBook = {
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
          toc: content.toc,
          id: content.id,
        }
        return epubFormat
      }
      case 'MOBI': {
        const mobiFormat: IBindingsMobiBook = {
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
          toc: content.toc,
        }
        return mobiFormat
      }
      default: {
        throw new Error('format not implemented')
      }
    }
  }

  async _getBookImg(content: IBindingsBookType): Promise<IBindingsBookType> {
    const appService = getAppClient()
    const appDir = await appService.getAppDataDir()

    content.metadata.cover = convertFileSrc(`${appDir}/eBookNook/covers/${content.id}.png`)

    return content
  }
}
