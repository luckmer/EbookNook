import { ISettingsState } from '@interfaces/settings/interfaces'
import { setStylesImportant } from './utils'

export class Frame {
  private observer: ResizeObserver
  element: HTMLDivElement
  private iframe: HTMLIFrameElement
  private contentRange = document.createRange()
  private spacer: HTMLDivElement
  private totalWidth = 0
  private viewportWidth = 0
  private currentPage = 1
  private totalPages = 1
  private padding = 20
  private queue: Promise<void> = Promise.resolve()
  private progressCallback?: (current: number, total: number) => void
  private linkClickCallback?: (href: string) => void
  private onIframeScroll?: EventListener
  private blobUrl?: string
  private chapterStyles: Partial<ISettingsState> = {}

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

    this.element.appendChild(this.iframe)

    this.spacer = document.createElement('div')
    Object.assign(this.spacer.style, {
      width: '0px',
      height: '1px',
      breakBefore: 'column',
      breakInside: 'avoid',
    })

    this.observer = new ResizeObserver(() => this.expand())
  }

  progress(callback: (current: number, total: number) => void) {
    this.progressCallback = callback
    callback(this.currentPage, this.totalPages)
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

  setStyles(styles: ISettingsState) {
    this.chapterStyles = { ...this.chapterStyles, ...styles }
    this.applyStyles()
  }

  private applyStyles() {
    const doc = this.document
    if (!doc) return

    const defaultStyles = {
      'font-size': `${this.chapterStyles.defaultFontSize ?? 16}px`,
      'font-weight': `${this.chapterStyles.fontWeight ?? 400}`,
      'line-height': this.chapterStyles.lineHeight ? `${this.chapterStyles.lineHeight}` : '1.5',
      'word-spacing': this.chapterStyles.wordSpacing
        ? `${this.chapterStyles.wordSpacing}px`
        : 'normal',
      'letter-spacing': this.chapterStyles.letterSpacing
        ? `${this.chapterStyles.letterSpacing}px`
        : 'normal',
      'text-indent': this.chapterStyles.textIndent ? `${this.chapterStyles.textIndent}px` : '0px',
      'box-sizing': 'border-box',
      overflow: 'hidden',
      padding: `0px ${this.padding}px`,
    }

    const bodyStyles = {
      margin: '0',
      color: '#fff',
      'column-width': '600px',
      'column-gap': '40px',
      'column-fill': 'auto',
      'word-wrap': 'break-word',
      'box-sizing': 'border-box',
    }

    setStylesImportant(doc.documentElement, defaultStyles)
    setStylesImportant(doc.body, bodyStyles)
  }

  onLinkClick(callback: (href: string) => void) {
    this.linkClickCallback = callback
  }

  attachLinkHandler() {
    const doc = this.document
    if (!doc) return

    doc.addEventListener('click', (e) => {
      e.preventDefault()
      const target = e.target as HTMLElement
      if (!target) return

      const anchor = target.closest('a') as HTMLAnchorElement | null
      if (!anchor || !anchor.href) return

      e.preventDefault()
      const href = anchor.getAttribute('href')!
      this.linkClickCallback?.(href)
    })
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
          this.applyStyles()
          doc.body.appendChild(this.spacer)
          this.contentRange.selectNodeContents(doc.body)
          this.observer.observe(doc.body)
          await doc.fonts.ready
          this.attachIframeScrollListener()
          this.attachLinkHandler()
          this.expand()
          this.goTo(0)
          this.iframe.style.opacity = '1'
          resolve()
        }
      })
    })
  }

  private attachIframeScrollListener() {
    const win = this.iframe.contentWindow
    if (!win) return
    this.onIframeScroll = () => this.updatePageFromScroll()
    win.addEventListener('scroll', this.onIframeScroll, { passive: true })
  }

  private removeIframeScrollListener() {
    const win = this.iframe.contentWindow
    if (win && this.onIframeScroll) {
      win.removeEventListener('scroll', this.onIframeScroll)
      this.onIframeScroll = undefined
    }
  }

  private calculatePagination() {
    const doc = this.document
    if (!doc) return

    const contentRect = this.contentRange.getBoundingClientRect()
    const rootRect = doc.documentElement.getBoundingClientRect()

    const contentStart = Math.max(0, contentRect.left - rootRect.left)
    const contentWidth = contentRect.width

    let realWidth = contentStart + contentWidth
    realWidth += this.padding

    this.viewportWidth = this.iframe.clientWidth || 1
    this.totalPages = Math.max(1, Math.ceil(realWidth / this.viewportWidth))
    this.totalWidth = this.totalPages * this.viewportWidth
  }

  private updatePageFromScroll() {
    const win = this.iframe.contentWindow
    if (!win) return

    const scrollLeft = win.scrollX
    this.calculatePagination()

    const maxScroll = this.totalWidth - this.viewportWidth

    if (scrollLeft >= maxScroll - 1) {
      this.currentPage = this.totalPages
    } else {
      this.currentPage = Math.floor(scrollLeft / this.viewportWidth) + 1
    }

    this.progressCallback?.(this.currentPage, this.totalPages)
  }

  goTo(tocProgress: number) {
    const win = this.iframe.contentWindow
    if (!win) return

    this.calculatePagination()

    const anchorLeft = tocProgress + win.scrollX
    const page = Math.floor(anchorLeft / this.viewportWidth)

    this.goToPage(page + 1)
  }

  private scrollToPage(page: number) {
    this.calculatePagination()

    this.currentPage = Math.max(1, Math.min(page, this.totalPages))

    let scrollPosition =
      this.currentPage === this.totalPages
        ? this.totalWidth - this.viewportWidth
        : this.viewportWidth * (this.currentPage - 1)

    this.iframe.contentWindow?.scrollTo({
      left: scrollPosition,
      top: 0,
      behavior: 'instant',
    })

    this.progressCallback?.(this.currentPage, this.totalPages)
  }

  expand() {
    this.calculatePagination()
    this.scrollToPage(this.currentPage)
  }

  goToPage(page: number) {
    this.scrollToPage(page)
  }

  nextPage() {
    if (this.canGoNext()) {
      this.scrollToPage(this.currentPage + 1)
    }
  }

  prevPage() {
    if (this.canGoPrev()) {
      this.scrollToPage(this.currentPage - 1)
    }
  }

  canGoNext() {
    return this.currentPage < this.totalPages
  }

  canGoPrev() {
    return this.currentPage > 1
  }

  destroy() {
    try {
      if (this.document?.body) this.observer.unobserve(this.document.body)
    } catch {}
    this.removeIframeScrollListener()
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl)
      this.blobUrl = undefined
    }
    this.element.remove()
  }
}
