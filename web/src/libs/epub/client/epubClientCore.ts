import { IBook, IToc } from '@interfaces/book/interfaces'
import { rstr2hex } from '@utils/index'
import { EpubMetadataParser } from '../lib/epubMetadata'
import { EpubTocParser } from '../lib/toc'
import { EpubUtils } from '../utils'
import { ZipParser } from '../lib/zipParser'

export default class EpubClientCore {
  private metadataParser = new EpubMetadataParser()
  private tocParser = new EpubTocParser()
  private zipParser = new ZipParser()

  async _open(file: File): Promise<IBook> {
    const buffer = await file.arrayBuffer()
    const xml = await this.zipParser.load(buffer)
    const metadata = await this.metadataParser.parse(file, xml)

    return {
      format: 'EPUB',
      hash: rstr2hex(metadata.title),
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
  }

  async _loadBook(serializedFile: string): Promise<IToc[]> {
    const buffer = EpubUtils.binaryStringToArrayBuffer(serializedFile)
    const xml = await this.zipParser.load(buffer)
    const toc = await this.tocParser.parse(xml)

    return toc
  }
}
