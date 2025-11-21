import { Chapter } from '@interfaces/book/interfaces'
import { setStylesImportant } from './utils'

export class Frame {
  private chapter?: Chapter
  private selectedChapter: string = ''
  private observer: ResizeObserver
  element: HTMLDivElement
  private iframe: HTMLIFrameElement
  private totalWidth = 0
  private viewportWidth = 0
  private currentPage = 0
  private totalPages = 1
  private onExpand: (current: number, total: number) => void
  private queue: Promise<void> = Promise.resolve()
  private onIframeScroll?: EventListenerOrEventListenerObject
  private blobUrl?: string
  private orientationTimeout?: number

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
    container.appendChild(this.element)

    this.observer = new ResizeObserver(() => this.expand())

    window.addEventListener('orientationchange', () => {
      clearTimeout(this.orientationTimeout)
      this.orientationTimeout = window.setTimeout(() => this.expand(), 500)
    })
  }

  private enqueue(action: () => Promise<void>) {
    this.queue = this.queue.then(() => action()).catch(console.error)
    return this.queue
  }

  get document() {
    return this.iframe.contentDocument!
  }

  async load(chapter: Chapter, selectedChapter: string) {
    return this.enqueue(async () => {
      this.chapter = chapter
      this.selectedChapter = selectedChapter

      const blob = new Blob([chapter.content], { type: 'text/html' })
      if (this.blobUrl) URL.revokeObjectURL(this.blobUrl)
      this.blobUrl = URL.createObjectURL(blob)
      this.iframe.src = this.blobUrl

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
          this.goTo(this.selectedChapter)
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
      win.removeEventListener('scroll', this.onIframeScroll as EventListener)
      this.onIframeScroll = undefined
    }
  }

  private updateCurrentPageFromScroll() {
    const doc = this.document
    if (!doc) return

    this.totalWidth = doc.documentElement.scrollWidth
    this.viewportWidth = this.iframe.clientWidth || 1
    this.totalPages = Math.max(1, Math.ceil(this.totalWidth / this.viewportWidth))

    const win = this.iframe.contentWindow
    const scrollLeft = win ? win.scrollX ?? win.pageXOffset ?? 0 : 0
    let page = Math.round(scrollLeft / this.viewportWidth)
    page = Math.max(0, Math.min(page, this.totalPages - 1))

    if (page !== this.currentPage) this.currentPage = page
    this.onExpand(this.currentPage + 1, this.totalPages)
  }

  resolveNavigation(href: string) {
    if (!this.chapter) return
    return this.chapter.resolveHref(href)
  }

  goTo(href: string) {
    if (!this.chapter) return
    const resolved = this.resolveNavigation(href)
    if (!resolved) return

    const doc = this.document
    const anchor = resolved.anchor?.(doc)

    this.totalWidth = doc.documentElement.scrollWidth
    this.viewportWidth = this.iframe.clientWidth || 1
    this.totalPages = Math.max(1, Math.ceil(this.totalWidth / this.viewportWidth))

    if (anchor) {
      const anchorLeft =
        anchor.getBoundingClientRect().left + (this.iframe.contentWindow?.scrollX || 0)
      const page = Math.floor(anchorLeft / this.viewportWidth)
      this.currentPage = Math.min(page, this.totalPages - 1)
    } else {
      this.currentPage = 0
    }

    this.scrollToPage(this.currentPage)
  }

  expand() {
    const doc = this.document
    if (!doc) return

    this.totalWidth = doc.documentElement.scrollWidth
    this.viewportWidth = this.iframe.clientWidth || 1
    this.totalPages = Math.max(1, Math.ceil(this.totalWidth / this.viewportWidth))

    this.currentPage = Math.min(this.currentPage, this.totalPages - 1)
    this.scrollToPage(this.currentPage)
    this.updateCurrentPageFromScroll()
  }

  private scrollToPage(page: number) {
    this.currentPage = Math.max(0, Math.min(page, this.totalPages - 1))
    this.iframe.contentWindow?.scrollTo({
      left: this.viewportWidth * this.currentPage,
      top: 0,
      behavior: 'instant',
    })

    setTimeout(() => this.updateCurrentPageFromScroll(), 0)
  }

  nextPage() {
    this.scrollToPage(Math.min(this.currentPage + 1, this.totalPages - 1))
  }

  prevPage() {
    this.scrollToPage(Math.max(this.currentPage - 1, 0))
  }

  currentLocation() {
    const win = this.iframe.contentWindow
    return {
      page: this.currentPage + 1,
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
