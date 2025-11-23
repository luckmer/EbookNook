import { Chapter, IXML } from '@interfaces/book/interfaces'

export class EpubContentParser {
  async parse(xml: IXML): Promise<{ chapters: Chapter[] }> {
    const doc = xml.doc

    const manifest: Record<string, { href: string; type?: string }> = {}
    doc.querySelectorAll('manifest > item').forEach((item) => {
      const id = item.getAttribute('id') || ''
      const href = item.getAttribute('href') || ''
      const type = item.getAttribute('media-type') || ''
      if (id && href) manifest[id] = { href, type }
    })

    const spine = Array.from(doc.querySelectorAll('spine > itemref'))

    const blobMap = await this.buildBlobMap(xml, manifest)

    const chapters: Chapter[] = []

    for (let index = 0; index < spine.length; index++) {
      const idref = spine[index].getAttribute('idref')
      if (!idref || !manifest[idref]) continue

      const href = manifest[idref].href
      const fullPath = (xml.basePath + href).replace(/\\/g, '/')
      const text = await xml.zip.file(fullPath)?.async('text')
      if (!text) continue

      const chapterDoc = new DOMParser().parseFromString(text, 'text/html')

      this.replaceAssets(chapterDoc, xml.basePath, blobMap)

      chapters.push({
        id: idref,
        href,
        index,
        content: chapterDoc.documentElement.outerHTML,
      })
    }

    return { chapters }
  }

  private replaceAssets(doc: Document, base: string, blobs: Map<string, string>) {
    doc.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src')
      if (!src) return
      const path = (base + src).replace(/\\/g, '/')
      if (blobs.has(path)) img.src = blobs.get(path)!
    })

    doc.querySelectorAll<HTMLLinkElement>("link[rel='stylesheet']").forEach((link) => {
      const href = link.getAttribute('href')
      if (!href) return
      const path = (base + href).replace(/\\/g, '/')
      if (blobs.has(path)) link.href = blobs.get(path)!
    })
  }

  private async buildBlobMap(xml: IXML, manifest: Record<string, { href: string; type?: string }>) {
    const map = new Map<string, string>()

    for (const id in manifest) {
      const full = (xml.basePath + manifest[id].href).replace(/\\/g, '/')
      const file = xml.zip.file(full)
      if (!file) continue

      try {
        const blob = await file.async('blob')
        const url = URL.createObjectURL(blob)
        map.set(full, url)
      } catch {}
    }

    return map
  }
}
