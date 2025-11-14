import { Chapter, IBook, IToc, IXML } from '@interfaces/book/interfaces'
import { rstr2hex } from '@utils/index'
import JSZip from 'jszip'
import { EpubMetadataParser } from './lib/epubMetadata'
import { EpubContentParser } from './lib/chapters'
import { EpubTocParser } from './lib/toc'
import { MIME } from './lib/static'
import { EpubUtils } from './lib/utils'

export default class EpubApiClientProvider {
  private metadataParser = new EpubMetadataParser()
  private contentParser = new EpubContentParser()
  private tocParser = new EpubTocParser()

  async load(buffer: ArrayBuffer): Promise<IXML> {
    const zip = await JSZip.loadAsync(buffer)

    const containerXml = await zip.file('META-INF/container.xml')?.async('text')
    if (!containerXml) throw new Error('META-INF/container.xml not found')

    const containerDoc = EpubUtils.parseXml(containerXml, MIME.XML)
    const rootFilePath = containerDoc.querySelector('rootfile')?.getAttribute('full-path')
    if (!rootFilePath) throw new Error('OPF path not found')

    const opfText = await zip.file(rootFilePath)?.async('text')
    if (!opfText) throw new Error('OPF not found')

    const basePath = rootFilePath.substring(0, rootFilePath.lastIndexOf('/') + 1)

    return {
      rootFilePath: EpubUtils.arrayBufferToBinaryString(buffer),
      filePath: rootFilePath,
      basePath,
      doc: EpubUtils.parseXml(opfText, MIME.XML),
      zip,
    }
  }

  async _open(file: File): Promise<IBook> {
    const buffer = await file.arrayBuffer()
    const xml = await this.load(buffer)
    const metadata = await this.metadataParser.parse(file, xml)

    return {
      format: 'EPUB',
      hash: rstr2hex(metadata.title),
      title: metadata.title,
      author: metadata.author,
      rootFilePath: xml.rootFilePath,
      sourceTitle: metadata.title,
      createdAt: Date.now(),
      downloadedAt: Date.now(),
      updatedAt: Date.now(),
      uploadedAt: null,
      deletedAt: null,
      metadata,
    }
  }

  async _loadBook(serializedFile: string): Promise<{ chapters: Chapter[]; toc: IToc[] }> {
    const buffer = EpubUtils.binaryStringToArrayBuffer(serializedFile)
    const xml = await this.load(buffer)

    const toc = await this.tocParser.parse(xml)
    const { chapters } = await this.contentParser.parse(xml, toc)

    return { toc, chapters }
  }
}
