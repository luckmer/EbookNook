import JSZip from 'jszip'
import { MIME } from './static'
import { Chapter, IBook, IMetadata } from '@interfaces/book/interfaces'
import { rstr2hex } from '@utils/index'

export type MetadataOptions = {
  includeCover?: boolean
  includeRaw?: boolean
}

export type IXML = {
  rootFilePath: string
  basePath: string
  doc: Document
  zip: JSZip
}

class EpubApiClientProvider {
  arrayBufferToBinaryString(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let str = ''
    const chunkSize = 0x8000
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize)
      str += String.fromCharCode(...chunk)
    }
    return str
  }

  binaryStringToArrayBuffer(str: string): ArrayBuffer {
    const buffer = new ArrayBuffer(str.length)
    const bytes = new Uint8Array(buffer)
    for (let i = 0; i < str.length; i++) {
      bytes[i] = str.charCodeAt(i)
    }
    return buffer
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

  async _loadXML(file: File): Promise<IXML> {
    const buffer = await file.arrayBuffer()

    const zip = await JSZip.loadAsync(buffer)

    const containerXml = await zip.file('META-INF/container.xml')?.async('text')
    if (!containerXml) throw new Error('META-INF/container.xml not found')

    const containerDoc = this.parseFromString(containerXml, MIME.XML)
    const rootFilePath = containerDoc.querySelector('rootfile')?.getAttribute('full-path')

    if (!rootFilePath) throw new Error('OPF path not found')

    const opfXml = await zip.file(rootFilePath)?.async('text')
    if (!opfXml) throw new Error('OPF not found')

    const basePath = rootFilePath.substring(0, rootFilePath.lastIndexOf('/') + 1)

    return {
      basePath,
      rootFilePath: this.arrayBufferToBinaryString(buffer),
      doc: this.parseFromString(opfXml, MIME.XML),
      zip,
    }
  }

  private async _getMetadata(file: File, xml: IXML): Promise<IMetadata> {
    const metadataEl = xml.doc.querySelector('metadata')
    if (!metadataEl) throw new Error('No metadata section found in OPF')

    const meta: IMetadata = {
      identifier: this.getMetaValue(metadataEl, 'identifier', 'identifier') || crypto.randomUUID(),
      title:
        this.getMetaValue(metadataEl, 'title', 'title', file.name.replace(/\.[^/.]+$/, '')) ||
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

  async _open(file: File): Promise<IBook> {
    const xml = await this._loadXML(file)
    const metadata = await this._getMetadata(file, xml)

    const book: IBook = {
      format: 'EPUB',
      hash: rstr2hex(metadata.title),
      title: metadata.title,
      rootFilePath: xml.rootFilePath,
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

  async _loadBook(filePath: string): Promise<Chapter[]> {
    const buffer = this.binaryStringToArrayBuffer(filePath)
    const zip = await JSZip.loadAsync(buffer)

    const containerXml = await zip.file('META-INF/container.xml')?.async('text')
    if (!containerXml) throw new Error('container.xml missing')

    const containerDoc = new DOMParser().parseFromString(containerXml, 'application/xml')
    const rootfilePath = containerDoc.querySelector('rootfile')?.getAttribute('full-path')
    if (!rootfilePath) throw new Error('OPF path not found')

    const basePath = rootfilePath.substring(0, rootfilePath.lastIndexOf('/') + 1)
    const opfXml = await zip.file(rootfilePath)?.async('text')
    if (!opfXml) throw new Error('OPF file missing')

    const opfDoc = new DOMParser().parseFromString(opfXml, 'application/xml')
    const manifestItems = new Map(
      Array.from(opfDoc.querySelectorAll('manifest > item')).map((item) => [
        item.getAttribute('id'),
        item.getAttribute('href'),
      ])
    )
    const spineItems = Array.from(opfDoc.querySelectorAll('spine > itemref'))

    const fileMap = new Map<string, string>()

    for (const [_, href] of manifestItems.entries()) {
      const filePath = (basePath + href).replace(/\\/g, '/')
      const file = zip.file(filePath)
      if (file) {
        const blob = await file.async('blob')
        const url = URL.createObjectURL(blob)
        fileMap.set(filePath, url)
      }
    }

    const chapterList: Chapter[] = []

    for (const itemRef of spineItems) {
      const idref = itemRef.getAttribute('idref')
      const href = manifestItems.get(idref || '')
      if (!href) continue

      const normalizedPath = (basePath + href).replace(/\\/g, '/')
      const html = await zip.file(normalizedPath)?.async('text')

      if (html && idref) {
        const doc = new DOMParser().parseFromString(html, 'text/html')

        doc.querySelectorAll('img').forEach((img) => {
          const src = img.getAttribute('src')
          if (src && fileMap.has(basePath + src)) {
            img.src = fileMap.get(basePath + src)!
          }
        })

        doc.querySelectorAll('link[rel=stylesheet]').forEach((link) => {
          const href = link.getAttribute('href')
          if (href && fileMap.has(basePath + href)) {
            link.href = fileMap.get(basePath + href)!
          }
        })

        const fixedHtml = doc.documentElement.outerHTML
        chapterList.push({ id: idref, content: fixedHtml })
      }
    }

    return chapterList
  }
}

export default EpubApiClientProvider
