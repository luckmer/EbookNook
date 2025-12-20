import { BookFormat } from '@interfaces/book/enums'
import { IBook, IBookState } from '@interfaces/book/interfaces'
import { rstr2hex } from '@utils/index'
import { EpubContentParser } from '../lib/chapters'
import { EpubMetadataParser } from '../lib/epubMetadata'
import { EpubTocParser } from '../lib/toc'
import { ZipParser } from '../lib/zipParser'

export default class EpubClientCore {
  private metadataParser = new EpubMetadataParser()
  private contentParser = new EpubContentParser()
  private tocParser = new EpubTocParser()
  private zipParser = new ZipParser()

  async _init(file: File): Promise<IBookState> {
    const buffer = await file.arrayBuffer()
    const xml = await this.zipParser.load(buffer)
    const [toc, chapters, metadata] = await Promise.all([
      this.tocParser.parse(xml),
      this.contentParser.parse(xml),
      this.metadataParser.parse(file, xml),
    ])

    const book: IBook = {
      format: BookFormat.EPUB,
      hash: rstr2hex(metadata.title),
      id: rstr2hex(metadata.title),
      title: metadata.title,
      author: metadata.author,
      rootFilePath: xml.rootFilePath,
      sourceTitle: metadata.title,
      createdAt: Date.now(),
      progress: ['', ''],
      downloadedAt: Date.now(),
      updatedAt: Date.now(),
      uploadedAt: null,
      deletedAt: null,
      metadata,
    }

    return {
      format: BookFormat.EPUB,
      book,
      chapters,
      toc,
    }
  }
}
