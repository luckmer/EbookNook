import { Metadata } from '@bindings/epub'
import { IXML } from '@interfaces/book/interfaces'

export class EpubMetadataParser {
  private getMetaValue(parent: Element, tag: string, metaName = tag, fallback = '') {
    const direct = parent.querySelector(tag)
    if (direct?.textContent?.trim()) return direct.textContent.trim()

    const meta = parent.querySelector(`meta[name='${metaName}']`)
    const content = meta?.getAttribute('content')
    if (content?.trim()) return content.trim()

    const ns = parent.querySelector(`dc\\:${tag}, opf\\:${tag}`)
    if (ns?.textContent?.trim()) return ns.textContent.trim()

    return fallback
  }

  private getStringList(parent: Element, sel: string): string[] {
    return Array.from(parent.querySelectorAll(sel))
      .map((e) => e.textContent?.trim())
      .filter((s): s is string => !!s)
  }

  public async parse(file: File, xml: IXML): Promise<Metadata> {
    const metadataEl = xml.doc.querySelector('metadata')
    if (!metadataEl) throw new Error('No metadata found')

    const meta: Metadata = {
      identifier: this.getMetaValue(metadataEl, 'identifier', 'identifier') || crypto.randomUUID(),
      title:
        this.getMetaValue(metadataEl, 'title', 'title', file.name.replace(/\..+$/, '')) ||
        'Untitled',
      author:
        this.getMetaValue(metadataEl, 'creator') ||
        this.getMetaValue(metadataEl, 'contributor', 'contributor', 'Unknown Author'),
      language: this.getStringList(metadataEl, 'language'),
      description: this.getMetaValue(metadataEl, 'description'),
      publisher: this.getMetaValue(metadataEl, 'publisher'),
      published: this.getMetaValue(metadataEl, 'date'),
      modified: metadataEl.querySelector("meta[property='dcterms:modified']")?.textContent?.trim(),
      subject: this.getStringList(metadataEl, 'subject'),
      rights: this.getMetaValue(metadataEl, 'rights'),
    }

    const seriesName = metadataEl
      .querySelector("meta[name='calibre:series']")
      ?.getAttribute('content')
    const seriesIndex = metadataEl
      .querySelector("meta[name='calibre:series_index']")
      ?.getAttribute('content')

    if (seriesName) {
      meta.seriesName = seriesName
      meta.seriesPosition = seriesIndex ? parseFloat(seriesIndex) : undefined
    }

    await this.extractCover(meta, xml)

    return meta
  }

  private async extractCover(meta: Metadata, xml: IXML) {
    try {
      const doc = xml.doc

      let coverPath =
        doc.querySelector("manifest > item[properties='cover-image']")?.getAttribute('href') ||
        doc.querySelector("item[id*='cover'], item[href*='cover']")?.getAttribute('href') ||
        ''

      if (!coverPath) {
        const coverId = doc.querySelector("meta[name='cover']")?.getAttribute('content')
        if (coverId) {
          coverPath = doc.querySelector(`item[id='${coverId}']`)?.getAttribute('href') || ''
        }
      }

      if (!coverPath) return

      if (coverPath.match(/\.(x?html?)$/i)) {
        coverPath = await this.extractImageFromCoverHTML(xml, coverPath)
        if (!coverPath) return
      }

      const normalized = this.normalizePath(xml.basePath, coverPath)

      let file = xml.zip.file(normalized)
      if (!file) file = xml.zip.file(coverPath)
      if (!file) file = xml.zip.file(decodeURIComponent(normalized))

      if (!file) {
        return
      }

      const base64Data = await file.async('base64')

      const extension = coverPath.split('.').pop()?.toLowerCase()
      let mimeType = 'image/jpeg'
      if (extension === 'png') mimeType = 'image/png'
      if (extension === 'webp') mimeType = 'image/webp'
      if (extension === 'gif') mimeType = 'image/gif'
      if (extension === 'svg') mimeType = 'image/svg+xml'

      meta.cover = `data:${mimeType};base64,${base64Data}`
    } catch {}
  }

  private async extractImageFromCoverHTML(xml: IXML, htmlPath: string): Promise<string> {
    try {
      const normalized = this.normalizePath(xml.basePath, htmlPath)
      let file = xml.zip.file(normalized)
      if (!file) file = xml.zip.file(htmlPath)

      if (!file) return ''

      const htmlContent = await file.async('text')
      const parser = new DOMParser()
      const htmlDoc = parser.parseFromString(htmlContent, 'text/html')

      const imgTag = htmlDoc.querySelector('img')
      if (!imgTag) return ''

      const imgSrc = imgTag.getAttribute('src')
      if (!imgSrc) return ''

      const htmlDir = htmlPath.substring(0, htmlPath.lastIndexOf('/') + 1)
      return this.normalizePath(htmlDir, imgSrc)
    } catch {
      return ''
    }
  }

  private normalizePath(basePath: string, relativePath: string): string {
    relativePath = relativePath.replace(/^\/+/, '')
    let combined = basePath + relativePath
    combined = combined.replace(/\\/g, '/')

    const parts = combined.split('/')
    const resolved: string[] = []

    for (const part of parts) {
      if (part === '..') {
        resolved.pop()
      } else if (part !== '.' && part !== '') {
        resolved.push(part)
      }
    }

    return resolved.join('/')
  }
}
