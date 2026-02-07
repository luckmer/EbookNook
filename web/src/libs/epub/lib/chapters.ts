import { Chapter } from '@bindings/epub'
import { IXML } from '@interfaces/book/interfaces'

export class EpubContentParser {
  public async parse(xml: IXML): Promise<Chapter[]> {
    const doc = xml.doc

    const manifest: Record<string, { href: string; type?: string }> = {}
    doc.querySelectorAll('manifest > item').forEach((item) => {
      const id = item.getAttribute('id') || ''
      const href = item.getAttribute('href') || ''
      const type = item.getAttribute('media-type') || ''
      if (id && href) manifest[id] = { href, type }
    })

    const spine = Array.from(doc.querySelectorAll('spine > itemref'))

    const assetMap = await this.buildAssetMap(xml, manifest)

    const chapters: Chapter[] = []

    for (let index = 0; index < spine.length; index++) {
      const idref = spine[index].getAttribute('idref')
      if (!idref || !manifest[idref]) continue

      const href = manifest[idref].href
      const fullPath = this.normalizePath(xml.basePath, href)
      const text = await xml.zip.file(fullPath)?.async('text')
      if (!text) continue

      const chapterDoc = new DOMParser().parseFromString(text, 'text/html')

      const chapterBase = fullPath.substring(0, fullPath.lastIndexOf('/') + 1)
      this.replaceAssets(chapterDoc, chapterBase, assetMap)

      chapters.push({
        id: idref,
        href,
        index,
        content: chapterDoc.documentElement.outerHTML,
      })
    }

    return chapters
  }

  private replaceAssets(doc: Document, chapterBase: string, assets: Map<string, string>) {
    doc.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src')
      if (!src) return

      const path = this.normalizePath(chapterBase, src)

      if (assets.has(path)) {
        img.src = assets.get(path)!
      }
    })

    doc.querySelectorAll<HTMLLinkElement>("link[rel='stylesheet']").forEach((link) => {
      const href = link.getAttribute('href')
      if (!href) return

      const path = this.normalizePath(chapterBase, href)

      if (assets.has(path)) {
        link.href = assets.get(path)!
      }
    })
  }

  private async buildAssetMap(
    xml: IXML,
    manifest: Record<string, { href: string; type?: string }>,
  ) {
    const map = new Map<string, string>()

    for (const id in manifest) {
      const item = manifest[id]
      const fullPath = this.normalizePath(xml.basePath, item.href)

      let file = xml.zip.file(fullPath)

      if (!file) {
        file = xml.zip.file(item.href)
      }

      if (!file) {
        file = xml.zip.file(decodeURIComponent(fullPath))
      }

      if (!file || !item.type) continue

      if (item.type.startsWith('image/') || item.type === 'text/css') {
        try {
          const base64 = await file.async('base64')
          const dataUri = `data:${item.type};base64,${base64}`

          map.set(fullPath, dataUri)
          map.set(item.href, dataUri)

          const decoded = decodeURIComponent(fullPath)
          if (decoded !== fullPath) {
            map.set(decoded, dataUri)
          }
        } catch (e) {
          console.error(`Failed to process asset: ${fullPath}`, e)
        }
      }
    }

    return map
  }

  private normalizePath(base: string, relative: string): string {
    relative = relative.replace(/^\/+/, '')

    let combined = base + relative

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
