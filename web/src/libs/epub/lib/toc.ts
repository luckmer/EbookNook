import { IToc, IXML } from '@interfaces/book/interfaces'
import { EpubUtils } from '../utils'
import { MIME } from './static'

export class EpubTocParser {
  async parse(xml: IXML): Promise<IToc[]> {
    const doc = xml.doc

    const manifestItems = Array.from(doc.querySelectorAll('manifest > item'))

    const navItem = manifestItems.find((i) => (i.getAttribute('properties') || '').includes('nav'))
    const ncxItem = manifestItems.find(
      (i) => i.getAttribute('media-type') === 'application/x-dtbncx+xml'
    )

    let tocDoc: Document | null = null

    if (navItem) {
      const navPath = (xml.basePath + (navItem.getAttribute('href') || '')).replace(/\\/g, '/')
      const txt = await xml.zip.file(navPath)?.async('text')
      tocDoc = txt ? EpubUtils.parseXml(txt, 'application/xhtml+xml') : null
    }

    if (!tocDoc && ncxItem) {
      const ncxPath = (xml.basePath + (ncxItem.getAttribute('href') || '')).replace(/\\/g, '/')
      const txt = await xml.zip.file(ncxPath)?.async('text')
      tocDoc = txt ? EpubUtils.parseXml(txt, MIME.XML) : null
    }

    if (!tocDoc) return []

    return tocDoc.querySelector('ncx') ? this.parseNcx(tocDoc) : this.parseNav(tocDoc)
  }

  private parseNav(navDoc: Document): IToc[] {
    const nav = Array.from(navDoc.querySelectorAll('nav')).find((n) => {
      const type = n.getAttribute('epub:type') || n.getAttribute('type')
      return type === 'toc'
    })

    if (!nav) return []

    const ol = nav.querySelector('ol')
    if (!ol) return []

    const parseList = (el: Element, parent?: string): IToc[] => {
      return Array.from(el.children)
        .filter((li) => li.tagName.toLowerCase() === 'li')
        .map<IToc | null>((li) => {
          const a = li.querySelector('a') || li.querySelector('span')
          if (!a) return null

          const id = li.getAttribute('id') || a.getAttribute('href') || ''
          const href = a.getAttribute('href') || ''
          const label = a.textContent?.trim() || ''
          const sub = li.querySelector('ol')

          return {
            id,
            href,
            label,
            parent,
            subitems: sub ? parseList(sub, id) : [],
          }
        })
        .filter((item): item is IToc => item !== null)
    }

    return parseList(ol)
  }

  private parseNcx(toc: Document): IToc[] {
    const points = Array.from(toc.querySelectorAll('navPoint'))
    const map: Record<string, IToc> = {}
    const roots: IToc[] = []

    for (const p of points) {
      const id = p.getAttribute('id') || ''
      const src = p.querySelector('content')?.getAttribute('src') || ''
      const label = p.querySelector('navLabel')?.textContent?.trim() || ''

      const parentNode = p.parentNode as Element
      const parent = parentNode?.tagName === 'navPoint' ? parentNode.getAttribute('id') : undefined

      map[id] = { id, href: src, label, subitems: [], parent }
    }

    Object.values(map).forEach((item) => {
      if (item.parent) map[item.parent]?.subitems?.push(item)
      else roots.push(item)
    })

    return roots
  }
}
