import { setStylesImportant } from './utils'

export class Frame {
  private observer: ResizeObserver
  element: HTMLDivElement
  private iframe: HTMLIFrameElement
  private totalWidth = 0
  private viewportWidth = 0
  private currentPage = 1
  private totalPages = 1
  private queue: Promise<void> = Promise.resolve()
  private progressCallback?: (current: number, total: number) => void
  private onIframeScroll?: EventListener
  private blobUrl?: string
  private orientationTimeout?: number

  constructor() {
    this.element = document.createElement('div')
    this.iframe = document.createElement('iframe')
    this.iframe.scrolling = 'no'
    this.iframe.style.border = 'none'

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
      scrollbarWidth: 'none',
    })

    this.iframe.style.cssText += `
      &::-webkit-scrollbar {
        width: 0px;
        height: 0px;
    }
    `
    this.element.appendChild(this.iframe)

    this.observer = new ResizeObserver(() => this.expand())

    window.addEventListener('orientationchange', () => {
      clearTimeout(this.orientationTimeout)
      this.orientationTimeout = window.setTimeout(() => this.expand(), 500)
    })
  }

  progress(callback: (current: number, total: number) => void) {
    this.progressCallback = callback

    this.progressCallback(this.currentPage, this.totalPages)
  }

  private enqueue(action: () => Promise<void>) {
    this.queue = this.queue.then(() => action()).catch(console.error)
    return this.queue
  }

  attachTo(selector: string) {
    return this.enqueue(async () => {
      const container = document.querySelector(selector)
      if (!container) throw new Error("Can't find container")
      container.appendChild(this.element)
    })
  }

  get document() {
    return this.iframe.contentDocument!
  }

  async loadChapter(content: string) {
    return this.enqueue(async () => {
      this.removeIframeScrollListener()
      this.currentPage = 1
      this.totalPages = 1

      const blob = new Blob([content], { type: 'text/html' })
      if (this.blobUrl) URL.revokeObjectURL(this.blobUrl)
      this.blobUrl = URL.createObjectURL(blob)
      this.iframe.src = this.blobUrl
      this.iframe.style.opacity = '0'

      await new Promise<void>((resolve) => {
        this.iframe.onload = async () => {
          const doc = this.document
          setStylesImportant(doc.documentElement, {
            'box-sizing': 'border-box',
            'column-width': '600px',
            'column-gap': '40px',
            'column-fill': 'auto',
            padding: '20px',
            color: '#fff',
            overflow: 'hidden',
          })
          setStylesImportant(doc.body, { margin: '0' })

          this.observer.observe(doc.body)
          await doc.fonts.ready
          this.attachIframeScrollListener()
          this.expand()
          this.goTo(0)
          this.iframe.style.opacity = '1'
          resolve()
        }
      })
    })
  }

  private attachIframeScrollListener() {
    this.removeIframeScrollListener()
    const win = this.iframe.contentWindow
    if (!win) return
    this.onIframeScroll = () => this.updateCurrentPageFromScroll()
    win.addEventListener('scroll', this.onIframeScroll, { passive: true })
  }

  private removeIframeScrollListener() {
    const win = this.iframe.contentWindow
    if (win && this.onIframeScroll) {
      win.removeEventListener('scroll', this.onIframeScroll)
      this.onIframeScroll = undefined
    }
  }

  private updateCurrentPageFromScroll() {
    const doc = this.document
    if (!doc) return

    const win = this.iframe.contentWindow
    const scrollLeft = win?.scrollX ?? 0

    this.totalWidth = doc.documentElement.scrollWidth
    this.viewportWidth = this.iframe.clientWidth ?? 1
    this.totalPages = Math.max(1, Math.ceil(this.totalWidth / this.viewportWidth))

    let page =
      scrollLeft + this.viewportWidth >= this.totalWidth
        ? this.totalPages
        : Math.round(scrollLeft / this.viewportWidth) + 1

    page = Math.max(1, Math.min(page, this.totalPages))

    if (page !== this.currentPage) {
      this.currentPage = page
      this.progressCallback?.(this.currentPage, this.totalPages)
    }
  }

  goTo(tocProgress: number) {
    const doc = this.document
    if (!doc) return

    this.totalWidth = doc.documentElement.scrollWidth
    this.viewportWidth = this.iframe.clientWidth ?? 1
    this.totalPages = Math.max(1, Math.ceil(this.totalWidth / this.viewportWidth))

    const anchorLeft = tocProgress + (this.iframe.contentWindow?.scrollX ?? 0)
    const page = Math.floor(anchorLeft / this.viewportWidth)
    this.currentPage = Math.min(page + 1, this.totalPages)
    this.scrollToPage(this.currentPage)
  }

  expand() {
    const doc = this.document
    if (!doc) return

    this.observer.disconnect()

    this.totalWidth = doc.documentElement.scrollWidth
    this.viewportWidth = this.iframe.clientWidth ?? 1
    this.totalPages = Math.max(1, Math.ceil(this.totalWidth / this.viewportWidth))
    this.currentPage = Math.min(this.currentPage, this.totalPages)

    this.scrollToPage(this.currentPage)

    this.observer.observe(doc.body)
  }

  private scrollToPage(page: number) {
    const doc = this.document
    if (!doc) return

    this.totalWidth = doc.documentElement.scrollWidth
    this.viewportWidth = this.iframe.clientWidth ?? 1
    this.totalPages = Math.max(1, Math.ceil(this.totalWidth / this.viewportWidth))

    this.currentPage = Math.max(1, Math.min(page, this.totalPages))

    let scrollPosition =
      this.currentPage === this.totalPages
        ? this.totalWidth - this.viewportWidth
        : this.viewportWidth * (this.currentPage - 1)

    this.iframe.contentWindow?.scrollTo({ left: scrollPosition, top: 0, behavior: 'instant' })

    this.progressCallback?.(this.currentPage, this.totalPages)
  }

  nextPage() {
    const { page, totalPages, scrollLeft } = this.currentLocation()

    if (this.canGoNext()) {
      this.scrollToPage(page + 1)
    } else {
      const doc = this.document
      const totalWidth = doc.documentElement.scrollWidth
      const viewportWidth = this.iframe.clientWidth ?? 1
      if (scrollLeft + viewportWidth <= totalWidth) {
        this.scrollToPage(totalPages)
      }
    }
  }

  prevPage() {
    const { page } = this.currentLocation()

    if (this.canGoPrev()) {
      this.scrollToPage(page - 1)
    }
  }

  canGoNext() {
    return this.currentPage < this.totalPages
  }

  canGoPrev() {
    return this.currentPage > 1
  }

  currentLocation() {
    const win = this.iframe.contentWindow
    return {
      page: this.currentPage,
      totalPages: this.totalPages,
      scrollLeft: win?.scrollX ?? 0,
      scrollTop: win?.scrollY ?? 0,
    }
  }

  destroy() {
    try {
      if (this.document?.body) this.observer.unobserve(this.document.body)
    } catch {}
    this.removeIframeScrollListener()
    if (this.blobUrl) {
      try {
        URL.revokeObjectURL(this.blobUrl)
      } catch {}
      this.blobUrl = undefined
    }
    this.element.remove()
  }
}
