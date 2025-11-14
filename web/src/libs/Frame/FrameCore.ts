import { setStylesImportant } from './utils'

export class Frame {
  private observer: ResizeObserver
  private element: HTMLDivElement
  private iframe: HTMLIFrameElement
  private totalWidth = 0
  private viewportWidth = 0
  private currentPage = 0
  private totalPages = 1
  private onExpand: (current: number, total: number) => void

  constructor({
    container,
    onExpand,
  }: {
    container: HTMLElement
    onExpand: (current: number, total: number) => void
  }) {
    this.onExpand = onExpand
    this.element = document.createElement('div')
    this.iframe = document.createElement('iframe')

    Object.assign(this.element.style, {
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    })

    Object.assign(this.iframe.style, {
      border: '0',
      width: '100%',
      height: '100%',
      maxWidth: '1400px',
      overflow: 'hidden',
    })

    this.iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts')
    this.element.appendChild(this.iframe)
    container.appendChild(this.element)

    this.observer = new ResizeObserver(() => this.expand())
  }

  get document() {
    return this.iframe.contentDocument!
  }

  async load(srcDoc: string) {
    const blob = new Blob([srcDoc], { type: 'text/html' })
    this.iframe.src = URL.createObjectURL(blob)

    return new Promise<void>((resolve) => {
      this.iframe.onload = async () => {
        const doc = this.document
        setStylesImportant(doc.documentElement, {
          'box-sizing': 'border-box',
          'column-width': '600px',
          'column-gap': '40px',
          'column-fill': 'auto',
          padding: '20px',
          overflow: 'hidden',
        })
        setStylesImportant(doc.body, { margin: '0' })

        this.observer.observe(doc.body)
        await doc.fonts.ready
        this.expand()
        resolve()
      }
    })
  }

  expand() {
    const doc = this.document
    this.totalWidth = doc.documentElement.scrollWidth
    this.viewportWidth = this.iframe.clientWidth
    this.totalPages = Math.max(1, Math.ceil(this.totalWidth / this.viewportWidth))

    this.currentPage = Math.min(this.currentPage, this.totalPages - 1)
    this.scrollToPage(this.currentPage)

    this.onExpand(this.currentPage + 1, this.totalPages)
  }

  private scrollToPage(page: number) {
    this.currentPage = page
    this.iframe.contentWindow?.scrollTo({
      left: this.viewportWidth * page,
      behavior: 'auto',
    })
  }

  nextPage() {
    this.scrollToPage(Math.min(this.currentPage + 1, this.totalPages - 1))
  }
  prevPage() {
    this.scrollToPage(Math.max(this.currentPage - 1, 0))
  }

  destroy() {
    if (this.document?.body) this.observer.unobserve(this.document.body)
    this.element.remove()
  }
}
