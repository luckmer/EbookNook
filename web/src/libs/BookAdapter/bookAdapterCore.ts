import { IBookFile } from '@bindings/book'
import { IBook } from '@interfaces/book/interfaces'
import { getAppClient } from '@libs/appService'
import { convertFileSrc } from '@tauri-apps/api/core'

export class BookAdapterCore {
  async _getBookFormat(content: IBook): Promise<IBookFile> {
    const appService = getAppClient()
    const appDir = await appService.getAppDataDir()

    const data = {
      percentageProgress: content.percentageProgress,
      rendition: content.rendition,
      sections: content.sections,
      toc: content.toc,
      progress: content.progress,
      format: content.format,
      id: content.id,
      metadata: {
        ...content.metadata,
        cover: convertFileSrc(`${appDir}/eBookNook/covers/${content.id}.png`),
      },
    }

    return data
  }

  async _invokeBookFormat(content: IBook): Promise<IBookFile> {
    const data = {
      percentageProgress: content.percentageProgress,
      metadata: content.metadata,
      rendition: content.rendition,
      progress: content.progress,
      sections: content.sections,
      format: content.format,
      toc: content.toc,
      id: content.id,
    }

    return data
  }

  async _getBookImg(content: IBookFile): Promise<IBookFile> {
    const appService = getAppClient()
    const appDir = await appService.getAppDataDir()

    const data = {
      ...content,
      metadata: {
        ...content.metadata,
        cover: convertFileSrc(`${appDir}/eBookNook/covers/${content.id}.png`),
      },
    }

    return data
  }
}
