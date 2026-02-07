import { ISettingsState } from '@interfaces/settings/interfaces'
import { getStyles, setStylesImportant } from './utils'

export class Frame {
  private observer: ResizeObserver
  element: HTMLDivElement
  private iframe: HTMLIFrameElement
  private spacer: HTMLDivElement
  private viewportWidth = 0
  private viewportHeight = 0
  private currentPage = 1
  private totalPages = 1
  private padding = 20
  private queue: Promise<void> = Promise.resolve()
  private progressCallback?: (current: number, total: number, offset: number) => void
  private linkClickCallback?: (href: string) => void
  private blobUrl?: string
  private chapterStyles: Partial<ISettingsState> = {}
  private isNavigating = false
  private lockedTotalPages = 0
  private isInitialLoad = true

  constructor() {
    this.element = document.createElement('div')
    this.iframe = document.createElement('iframe')
    this.iframe.setAttribute('scrolling', 'no')
    this.iframe.style.border = 'none'

    Object.assign(this.element.style, {
      boxSizing: 'border-box',
      position: 'relative',
      overflowX: 'hidden',
      overflowY: 'hidden',
      width: '100%',
      height: '100%',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      maxWidth: '1400px',
      margin: '0 auto',
    })

    Object.assign(this.iframe.style, {
      border: '0',
      display: 'block',
      height: '100%',
      overflow: 'hidden',
      width: '100%',
    })

    const style = document.createElement('style')
    style.textContent = '::-webkit-scrollbar { display: none; }'
    document.head.appendChild(style)

    this.element.appendChild(this.iframe)

    this.spacer = document.createElement('div')
    Object.assign(this.spacer.style, {
      width: '1px',
      height: '1px',
      marginTop: '-1px',
      visibility: 'hidden',
      display: 'block',
      clear: 'both',
    })

    this.observer = new ResizeObserver(() => {
      this.handleResize()
    })
  }

  get document() {
    return this.iframe.contentDocument!
  }

  private setImageSize() {
    const doc = this.document
    if (!doc?.body) return

    const elements = doc.body.querySelectorAll<HTMLElement>('img, svg, video')

    for (const el of elements) {
      setStylesImportant(el, {
        'max-height': `${this.viewportHeight - this.padding * 2}px`,
        'page-break-inside': 'avoid',
        'box-sizing': 'border-box',
        'break-inside': 'avoid',
        'object-fit': 'contain',
        background: '#181818',
        'max-width': '100%',
        display: 'block',
        height: 'auto',
        width: 'auto',
        margin: 'auto',
      })
    }
  }

  progress(callback: (current: number, total: number, offset: number) => void) {
    this.progressCallback = callback
    callback(this.currentPage, this.lockedTotalPages || this.totalPages, this.element.scrollLeft)
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

  setStyles(styles: ISettingsState) {
    try {
      const oldTotalPages = this.lockedTotalPages || this.totalPages
      const positionPercentage =
        oldTotalPages > 1 ? (this.currentPage - 1) / (oldTotalPages - 1) : 0

      this.chapterStyles = { ...this.chapterStyles, ...styles }
      this.applyStyles()
      this.setImageSize()
      this.expand()

      const newTotalPages = this.lockedTotalPages || this.totalPages
      if (newTotalPages > 1 && positionPercentage >= 0) {
        const newPage = Math.round(positionPercentage * (newTotalPages - 1)) + 1
        this.scrollToPage(Math.max(1, Math.min(newPage, newTotalPages)))
      } else {
        this.scrollToPage(1)
      }
    } catch (err) {
      console.log('failed to apply styles', err)
    }
  }

  private applyStyles() {
    const doc = this.document
    if (!doc) return

    const existingStyle = doc.getElementById('dynamic-styles')
    if (existingStyle) existingStyle.remove()

    const styleEl = doc.createElement('style')
    styleEl.id = 'dynamic-styles'

    const pStyles = `
    p {
        font-size: ${this.chapterStyles.defaultFontSize ?? 16}px !important;
        font-weight: ${this.chapterStyles.fontWeight ?? 400} !important;
        font-family: arial, helvetica, sans-serif !important;
        line-height: ${this.chapterStyles.lineHeight ?? 1.5} !important;
        word-spacing: ${this.chapterStyles.wordSpacing ? this.chapterStyles.wordSpacing + 'px' : 'normal'} !important;
        letter-spacing: ${this.chapterStyles.letterSpacing ? this.chapterStyles.letterSpacing + 'px' : 'normal'} !important;
        text-indent: ${this.chapterStyles.textIndent ? this.chapterStyles.textIndent + 'px' : '0px'} !important;
        margin-bottom: ${this.chapterStyles.paragraphMargin ? this.chapterStyles.paragraphMargin + 'px' : '1.5em'} !important;
        box-sizing: border-box !important;
      }
      p:first-child {
        margin-top: 0 !important;
      }
      p:last-child {
        margin-bottom: 0 !important;
      }
    `

    styleEl.textContent = getStyles(String(this.chapterStyles.lineHeight ?? 1.5)) + pStyles
    doc.head.appendChild(styleEl)

    const gap = 40

    const breakpoint = 800
    const columnCount = this.viewportWidth < breakpoint ? 1 : 2

    setStylesImportant(doc.documentElement, {
      'box-sizing': 'border-box',
      'column-count': `${columnCount}`,
      'column-gap': `${gap}px`,
      'column-fill': 'auto',
      height: `${this.viewportHeight}px`,
      width: `${this.viewportWidth}px`,
      padding: `0 ${gap / 2}px`,
      overflow: 'hidden',
      'overflow-wrap': 'break-word',
      position: 'static',
      margin: '0',
    })

    setStylesImportant(doc.body, {
      margin: '0',
      color: '#fff',
      background: '#181818',
      'font-family': 'arial, helvetica, sans-serif',
    })
  }

  onLinkClick(callback: (href: string) => void) {
    this.linkClickCallback = callback
  }

  attachLinkHandler() {
    const doc = this.document
    if (!doc) return

    doc.addEventListener('click', (e) => {
      const anchor = (e.target as HTMLElement).closest('a')
      if (anchor?.href) {
        e.preventDefault()
        const href = anchor.getAttribute('href')
        if (href) this.linkClickCallback?.(href)
      }
    })
  }

  private onElementScroll?: () => void

  private attachScrollListener() {
    this.removeScrollListener()

    this.onElementScroll = () => {
      if (this.isNavigating) return

      const scrollLeft = this.element.scrollLeft
      const pageWidth = this.viewportWidth

      const exactPage = scrollLeft / pageWidth + 1
      const page = Math.min(
        this.lockedTotalPages || this.totalPages,
        Math.max(1, Math.floor(exactPage + 0.5)),
      )

      if (this.currentPage !== page) {
        this.currentPage = page

        this.progressCallback?.(
          this.currentPage,
          this.lockedTotalPages || this.totalPages,
          this.element.scrollLeft,
        )
      }
    }

    this.element.addEventListener('scroll', this.onElementScroll, { passive: true })
  }

  private removeScrollListener() {
    if (this.onElementScroll) {
      this.element.removeEventListener('scroll', this.onElementScroll)
      this.onElementScroll = undefined
    }
  }

  async loadChapter(content: string) {
    return this.enqueue(async () => {
      this.removeScrollListener()
      this.currentPage = 1
      this.totalPages = 1
      this.isInitialLoad = true

      const blob = new Blob([content], { type: 'text/html' })
      if (this.blobUrl) URL.revokeObjectURL(this.blobUrl)
      this.blobUrl = URL.createObjectURL(blob)
      this.iframe.src = this.blobUrl
      this.iframe.style.opacity = '0'

      await new Promise<void>((resolve) => {
        this.iframe.onload = async () => {
          this.viewportWidth = this.element.clientWidth || 1
          this.viewportHeight = this.element.clientHeight || 1

          this.applyStyles()
          this.setImageSize()
          this.document.body.appendChild(this.spacer)
          await this.document.fonts.ready

          this.expand()

          this.attachScrollListener()
          this.attachLinkHandler()
          this.iframe.style.opacity = '1'

          this.observer.observe(this.element)

          this.progressCallback?.(this.currentPage, this.lockedTotalPages, this.element.scrollLeft)
          resolve()
        }
      })
    })
  }

  expand() {
    const doc = this.document
    if (!doc?.body) return

    const previousPage = this.currentPage

    doc.documentElement.style.setProperty('column-fill', 'balance', 'important')
    this.iframe.style.width = `${this.viewportWidth}px`

    void doc.documentElement.offsetHeight

    doc.documentElement.style.setProperty('column-fill', 'auto', 'important')
    this.iframe.style.width = `${this.viewportWidth * 500}px`

    void doc.documentElement.offsetHeight
    void doc.documentElement.scrollWidth

    let totalWidth = doc.documentElement.scrollWidth

    const allParagraphs = doc.body.querySelectorAll('p')

    if (allParagraphs.length > 0) {
      const lastP = allParagraphs[allParagraphs.length - 1]
      const computedStyle = doc.defaultView?.getComputedStyle(lastP)
      if (computedStyle) {
        const marginBottom = parseFloat(computedStyle.marginBottom) || 0

        if (marginBottom > 0) {
          totalWidth = Math.max(this.viewportWidth, totalWidth - marginBottom)
        }
      }
    }

    const exactPages = totalWidth / this.viewportWidth
    let pageCount = Math.ceil(exactPages)

    const epsilon = 0.0 // 0% tolerance
    const remainder = exactPages % 1

    if (pageCount > 1 && remainder < epsilon) {
      pageCount = Math.floor(exactPages)
    }

    pageCount = Math.max(1, pageCount)

    this.lockedTotalPages = pageCount
    this.totalPages = pageCount

    const physicalPageCount = pageCount + 2
    const expandedWidth = physicalPageCount * this.viewportWidth * 3
    this.iframe.style.width = `${expandedWidth}px`

    void doc.documentElement.offsetHeight

    if (this.isInitialLoad) {
      this.isInitialLoad = false
      this.currentPage = 1
    } else {
      this.currentPage = Math.min(previousPage, this.lockedTotalPages)
    }

    this.scrollToPage(this.currentPage)
  }

  public scrollToPage(page: number) {
    this.isNavigating = true
    const maxPage = this.lockedTotalPages || this.totalPages
    this.currentPage = Math.max(1, Math.min(page, maxPage))

    const offset = (this.currentPage - 1) * this.viewportWidth

    this.element.scrollLeft = offset

    this.progressCallback?.(this.currentPage, maxPage, this.element.scrollLeft)

    requestAnimationFrame(() => {
      this.isNavigating = false
    })
  }

  public getTotalScrollWidth(): number {
    return this.getTotalPages() * this.viewportWidth
  }

  public scrollToOffset(offset: number) {
    this.isNavigating = true

    const maxOffset = this.getTotalScrollWidth() - this.viewportWidth
    const clampedOffset = Math.max(0, Math.min(offset, maxOffset))

    this.element.scrollLeft = clampedOffset

    const page = Math.floor(clampedOffset / this.viewportWidth) + 1
    this.currentPage = Math.min(page, this.lockedTotalPages || this.totalPages)

    this.progressCallback?.(
      this.currentPage,
      this.lockedTotalPages || this.totalPages,
      this.element.scrollLeft,
    )

    requestAnimationFrame(() => {
      this.isNavigating = false
    })
  }

  private handleResize() {
    if (!this.document?.body) return

    const newWidth = this.element.clientWidth || 1
    const newHeight = this.element.clientHeight || 1

    if (newWidth === this.viewportWidth && newHeight === this.viewportHeight) return

    const progress =
      (this.currentPage - 1) / Math.max(1, (this.lockedTotalPages || this.totalPages) - 1)

    this.viewportWidth = newWidth
    this.viewportHeight = newHeight

    this.applyStyles()
    this.setImageSize()
    this.expand()

    const newPage = Math.round(progress * (this.lockedTotalPages - 1)) + 1
    this.scrollToPage(newPage)
  }

  public nextPage() {
    const maxPage = this.lockedTotalPages || this.totalPages
    if (this.currentPage < maxPage) {
      this.scrollToPage(this.currentPage + 1)
    }
  }

  public prevPage() {
    if (this.currentPage > 1) {
      this.scrollToPage(this.currentPage - 1)
    }
  }

  getCurrentPage() {
    return this.currentPage
  }

  getTotalPages() {
    return this.lockedTotalPages || this.totalPages
  }

  destroy() {
    this.observer.disconnect()
    this.removeScrollListener()
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl)
      this.blobUrl = undefined
    }
    this.element.remove()
  }
}
