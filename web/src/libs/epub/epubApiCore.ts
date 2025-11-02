import JSZip from 'jszip'
import { MIME } from './static'
import { IBook, IBookMetadata } from '@interfaces/book/interfaces'

export type MetadataOptions = {
  includeCover?: boolean
  includeRaw?: boolean
}

export type IXML = {
  basePath: string
  doc: Document
  zip: JSZip
}

class EpubApiClientProvider {
  file: File

  constructor(file: File) {
    this.file = file
  }

  async getArrayBuffer(file: File): Promise<ArrayBuffer> {
    return await file.arrayBuffer()
  }

  parseFromString(xml: string, parser: DOMParserSupportedType): Document {
    return new DOMParser().parseFromString(xml, parser)
  }

  private getSafeList(parent: Element, selector: string): string[] {
    return Array.from(parent.querySelectorAll(selector))
      .map((el) => el.textContent?.trim())
      .filter((v): v is string => !!v)
  }

  private getMetaValue(parent: Element, tag: string, attrName = tag, fallback = ''): string {
    const el = parent.querySelector(tag)
    if (el?.textContent?.trim()) return el.textContent.trim()

    const metaEl = parent.querySelector(`[name='${attrName}']`)
    const content = metaEl?.getAttribute('content')
    if (content?.trim()) return content.trim()

    const nsEl = parent.querySelector(`dc\\:${tag}, opf\\:${tag}`)
    if (nsEl?.textContent?.trim()) return nsEl.textContent.trim()

    return fallback
  }

  async _loadXML(): Promise<IXML> {
    const arrayBuffer = await this.getArrayBuffer(this.file)
    const zip = await JSZip.loadAsync(arrayBuffer)

    const containerXml = await zip.file('META-INF/container.xml')?.async('text')
    if (!containerXml) throw new Error('META-INF/container.xml not found')

    const containerDoc = this.parseFromString(containerXml, MIME.XML)
    const rootfilePath = containerDoc.querySelector('rootfile')?.getAttribute('full-path') || ''
    if (!rootfilePath) throw new Error('OPF path not found')

    const opfXml = await zip.file(rootfilePath)?.async('text')
    if (!opfXml) throw new Error('OPF not found')

    const basePath = rootfilePath.substring(0, rootfilePath.lastIndexOf('/') + 1)

    return {
      basePath,
      doc: this.parseFromString(opfXml, MIME.XML),
      zip,
    }
  }

  private async _getMetadata(xml: IXML): Promise<IBookMetadata> {
    const metadataEl = xml.doc.querySelector('metadata')
    if (!metadataEl) throw new Error('No metadata section found in OPF')

    const meta: IBookMetadata = {
      identifier: this.getMetaValue(metadataEl, 'identifier', 'identifier') || crypto.randomUUID(),
      title:
        this.getMetaValue(metadataEl, 'title', 'title', this.file.name.replace(/\.[^/.]+$/, '')) ||
        'Untitled',
      author:
        this.getMetaValue(metadataEl, 'creator', 'creator') ||
        this.getMetaValue(metadataEl, 'contributor', 'contributor', 'Unknown Author'),
      language: this.getSafeList(metadataEl, 'language'),
      description: this.getMetaValue(metadataEl, 'description'),
      publisher: this.getMetaValue(metadataEl, 'publisher'),
      published: this.getMetaValue(metadataEl, 'date'),
      modified:
        metadataEl.querySelector("meta[property='dcterms:modified']")?.textContent?.trim() ||
        undefined,
      subject: this.getSafeList(metadataEl, 'subject'),
      rights: this.getMetaValue(metadataEl, 'rights'),
    }

    const seriesName = metadataEl
      .querySelector("meta[name='calibre:series']")
      ?.getAttribute('content')
    const seriesIndex = metadataEl
      .querySelector("meta[name='calibre:series_index']")
      ?.getAttribute('content')

    if (seriesName) {
      meta.series = {
        name: seriesName,
        position: seriesIndex ? parseFloat(seriesIndex) : undefined,
      }
    }

    try {
      const manifestCover =
        xml.doc.querySelector("manifest > item[properties='cover-image']") ||
        xml.doc.querySelector("item[id*='cover'], item[href*='cover']")

      let coverPath = manifestCover?.getAttribute('href') || ''
      if (!coverPath) {
        const coverId = xml.doc.querySelector("meta[name='cover']")?.getAttribute('content')
        if (coverId) {
          coverPath = xml.doc.querySelector(`item[id='${coverId}']`)?.getAttribute('href') || ''
        }
      }

      if (coverPath) {
        const fullCoverPath = xml.basePath + coverPath
        const normalizedPath = fullCoverPath.replace(/\\/g, '/')
        const coverFile = xml.zip.file(normalizedPath)
        if (coverFile) {
          const blob = await coverFile.async('blob')
          meta.cover = URL.createObjectURL(blob)
        }
      }
    } catch {}

    return meta
  }

  async _open(): Promise<IBook> {
    const xml = await this._loadXML()
    const metadata = await this._getMetadata(xml)

    const book: IBook = {
      hash: '',
      format: 'EPUB',
      title: metadata.title,
      sourceTitle: metadata.title,
      author: metadata.author,
      createdAt: Date.now(),
      uploadedAt: null,
      deletedAt: null,
      downloadedAt: Date.now(),
      updatedAt: Date.now(),
      metadata,
    }

    return book
  }
}

export default EpubApiClientProvider
