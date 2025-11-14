import { IMetadata, IXML } from '@interfaces/book/interfaces'

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

  async parse(file: File, xml: IXML): Promise<IMetadata> {
    const metadataEl = xml.doc.querySelector('metadata')
    if (!metadataEl) throw new Error('No metadata found')

    const meta: IMetadata = {
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
      meta.series = {
        name: seriesName,
        position: seriesIndex ? parseFloat(seriesIndex) : undefined,
      }
    }

    await this.extractCover(meta, xml)

    return meta
  }

  private async extractCover(meta: IMetadata, xml: IXML) {
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

      const normalized = (xml.basePath + coverPath).replace(/\\/g, '/')
      const file = xml.zip.file(normalized)
      if (!file) return

      const blob = await file.async('blob')
      meta.cover = URL.createObjectURL(blob)
    } catch {}
  }
}
