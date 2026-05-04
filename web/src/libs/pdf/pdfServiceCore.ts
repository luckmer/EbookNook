//https://github.com/johnfactotum/foliate-js/blob/main/pdf.js
import { IBindingsPDFToc } from '@bindings/pdf'
import { IPDFMetadata, IPDFSections, IZoomEvent } from '@interfaces/book/pdf'
import * as pdfjsLib from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker?url'
import { Metadata } from 'pdfjs-dist/types/src/display/metadata'

const pdfjsBase = new URL('./vendor/', import.meta.url).toString()
const pdfjsPath = (path: string) => `${pdfjsBase}/${path}`

interface LinkService {
  goToDestination: () => void
  getDestinationHash: (dest: unknown) => string
  addLinkAttributes: (link: HTMLAnchorElement, url: string) => void
}

export type IOutline = {
  title: string
  bold: boolean
  italic: boolean
  /**
   * - The color in RGB format to use for
   * display purposes.
   */
  color: Uint8ClampedArray
  dest: string | Array<any> | null
  url: string | null
  unsafeUrl: string | undefined
  newWindow: boolean | undefined
  count: number | undefined
  items: Array<any>
}

interface Book {
  rendition: { layout: 'pre-paginated' }
  metadata: IPDFMetadata
  toc?: IBindingsPDFToc[]
  sections: IPDFSections[]
  isExternal: (uri: string) => boolean
  resolveHref: (href: string) => Promise<{ index: number }>
  splitTOCHref: (href: string) => Promise<[number, null]>
  getTOCFragment: (doc: Document) => HTMLElement
  getCover: () => Promise<Blob | null>
  destroy: () => void
}

export class PDFServiceCore {
  makeTOCItem = (item: IOutline): IBindingsPDFToc => ({
    label: item.title,
    href: JSON.stringify(item.dest),
    subitems:
      item.items && item.items.length ? item.items.map((sub) => this.makeTOCItem(sub)) : undefined,
  })

  render = async (page: any, doc: Document, zoom: number) => {
    const scale = zoom * devicePixelRatio
    doc.documentElement.style.transform = `scale(${1 / devicePixelRatio})`
    doc.documentElement.style.transformOrigin = 'top left'
    doc.documentElement.style.setProperty('--scale-factor', scale.toString())
    const viewport = page.getViewport({ scale })

    // the canvas must be in the `PDFDocument`'s `ownerDocument`
    // (`globalThis.document` by default); that's where the fonts are loaded
    const canvas = document.createElement('canvas')
    canvas.height = viewport.height
    canvas.width = viewport.width
    const canvasContext = canvas.getContext('2d')
    await page.render({ canvasContext, viewport }).promise

    doc.querySelector('#canvas')!.replaceChildren(doc.adoptNode(canvas))

    const container = doc.querySelector('.textLayer') as HTMLElement
    const textLayer = new pdfjsLib.TextLayer({
      textContentSource: await page.streamTextContent(),
      container,
      viewport,
    })
    await textLayer.render()

    // hide "offscreen" canvases appended to document when rendering text layer
    // https://github.com/mozilla/pdf.js/blob/642b9a5ae67ef642b9a8808fd9efd447e8c350e2/web/pdf_viewer.css#L51-L58
    for (const canvas of document.querySelectorAll('.hiddenCanvasElement')) {
      const el = canvas as HTMLCanvasElement

      Object.assign(el.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '0',
        height: '0',
        display: 'none',
      })
    }

    // https://github.com/mozilla/pdf.js/blob/642b9a5ae67ef642b9a8808fd9efd447e8c350e2/web/text_layer_builder.js#L105-L107
    const endOfContent = document.createElement('div')
    endOfContent.className = 'endOfContent'
    container.append(endOfContent)

    container.onpointerdown = () => container.classList.add('selecting')
    container.onpointerup = () => container.classList.remove('selecting')

    const div = doc.querySelector('.annotationLayer')
    const linkService: LinkService = {
      goToDestination: () => {},
      getDestinationHash: (dest: unknown) => JSON.stringify(dest),
      addLinkAttributes: (link: HTMLAnchorElement, url: string) => (link.href = url),
    }

    const annotations = await page.getAnnotations()
    // @ts-expect-error
    await new pdfjsLib.AnnotationLayer({ page, viewport, div, linkService }).render({
      annotations: annotations,
    })
  }

  renderPage = async (page: any, getImageBlob?: boolean) => {
    const viewport = page.getViewport({ scale: 1 })

    if (getImageBlob) {
      const canvas = document.createElement('canvas')
      canvas.height = viewport.height
      canvas.width = viewport.width
      const canvasContext = canvas.getContext('2d')
      await page.render({ canvasContext, viewport }).promise
      return new Promise((resolve) => canvas.toBlob(resolve))
    }
    const src = URL.createObjectURL(
      new Blob(
        [
          `
          <!DOCTYPE html>
          <html lang="en">
          <meta charset="utf-8">
          <meta name="viewport" content="width=${viewport.width}, height=${viewport.height}">
          <style>
          html, body {
              margin: 0;
              padding: 0;
          }
          :root {
            --user-unit: 1;
            --total-scale-factor: calc(var(--scale-factor) * var(--user-unit));
            --scale-round-x: 1px;
            --scale-round-y: 1px;
          }
          </style>
          <div id="canvas"></div>
          <div class="textLayer"></div>
          <div class="annotationLayer"></div>
      `,
        ],
        { type: 'text/html' },
      ),
    )
    const onZoom = ({ doc, scale }: IZoomEvent) => this.render(page, doc, scale)
    return { src, onZoom }
  }

  async _makeBook(file: File) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl
    const transport = new pdfjsLib.PDFDataRangeTransport(file.size, Uint8Array.from([]))

    const book: any = { rendition: { layout: 'pre-paginated' } }

    transport.requestDataRange = (begin, end) => {
      file
        .slice(begin, end)
        .arrayBuffer()
        .then((chunk) => {
          transport.onDataRange(begin, new Uint8Array(chunk))
        })
    }
    const pdf = await pdfjsLib.getDocument({
      range: transport,
      cMapUrl: pdfjsPath('cmaps/'),
      standardFontDataUrl: pdfjsPath('standard_fonts/'),
    }).promise

    const {
      metadata,
      info,
    }: {
      metadata: Metadata
      info: {
        Title?: string
        Author?: string
        Subject?: string
      }
    } = (await pdf.getMetadata()) ?? {}

    book.metadata = {
      title: metadata?.get('dc:title') ?? info?.Title,
      author: metadata?.get('dc:creator') ?? info?.Author,
      contributor: metadata?.get('dc:contributor'),
      description: metadata?.get('dc:description') ?? info?.Subject,
      language: metadata?.get('dc:language'),
      publisher: metadata?.get('dc:publisher'),
      published: '',
      subject: metadata?.get('dc:subject'),
      identifier: metadata?.get('dc:identifier'),
      source: metadata?.get('dc:source'),
      rights: metadata?.get('dc:rights'),
    }

    const outline = await pdf.getOutline()
    book.toc = outline?.map(this.makeTOCItem)

    const cache = new Map()
    book.sections = Array.from({ length: pdf.numPages }).map((_, i) => ({
      id: i,
      load: async () => {
        const cached = cache.get(i)
        if (cached) return cached
        const url = await this.renderPage(await pdf.getPage(i + 1))
        cache.set(i, url)
        return url
      },
      size: 1000,
    }))

    book.isExternal = (uri: string) => /^\w+:/i.test(uri)
    book.resolveHref = async (href: string) => {
      const parsed = JSON.parse(href)
      const dest = typeof parsed === 'string' ? await pdf.getDestination(parsed) : parsed
      const index = await pdf.getPageIndex(dest[0])
      return { index }
    }
    book.splitTOCHref = async (href: string) => {
      const parsed = JSON.parse(href)
      const dest = typeof parsed === 'string' ? await pdf.getDestination(parsed) : parsed
      const index = await pdf.getPageIndex(dest[0])
      return [index, null]
    }
    book.getTOCFragment = (doc: Document) => doc.documentElement
    book.getCover = async () => this.renderPage(await pdf.getPage(1), true)
    book.destroy = () => pdf.destroy()

    return book
  }

  async _init(file: File): Promise<Book> {
    return this._makeBook(file)
  }
}
