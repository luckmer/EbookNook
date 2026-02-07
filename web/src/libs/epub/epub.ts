import { Frame } from '@libs/Frame/FrameCore'
import { ISettingsState } from '@interfaces/settings/interfaces'
import { Chapter, Progress, Toc } from '@bindings/epub'
import { Epub as IEpub } from '@bindings/epub'
import { flatData } from '@utils/index'
import { STATIC_UNIT } from './lib/static'
import { IProgressInfo } from '@interfaces/index'

export interface IEpubChapter extends Chapter {
  chapterIndex: number
}

export interface IChapter extends Chapter {
  offset: number
  len: number
}

export class Epub {
  private totalPages: number = 0
  private currentStaticPage: number = 1
  chapterByPath: Record<string, IChapter> = {}
  chapters: IChapter[] = []
  frame = new Frame()
  totalWords = 0
  lastPath = ''
  toc: Toc[] = []

  constructor(public book: IEpub) {
    this.parseBook()
    this.calculateTotalPages()
    this.frame.onLinkClick((href) => this.handleLinkClick(href))
  }

  private parseBook() {
    let wordAcc = 0
    this.chapters = this.book.chapters.map((content) => {
      const text = content.content.replace(/<[^>]*>/g, '')
      const words = text
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0)
      const wordCount = words.length
      const chapter = { ...content, offset: wordAcc, len: wordCount }
      wordAcc += wordCount

      const formattedHref = this.formatHref(content.href)
      this.chapterByPath[formattedHref] = chapter

      return chapter
    })

    this.totalWords = wordAcc
    this.toc = flatData(this.book.toc)
  }

  private calculateTotalPages() {
    this.totalPages = 0

    for (const chapter of this.chapters) {
      const chapterPages = Math.max(1, Math.ceil(chapter.len / STATIC_UNIT))
      this.totalPages += chapterPages
    }
  }

  private getPagesBefore(chapterIndex: number): number {
    let pagesBefore = 0

    for (let i = 0; i < chapterIndex; i++) {
      const chapter = this.chapters[i]
      const chapterPages = Math.max(1, Math.ceil(chapter.len / STATIC_UNIT))
      pagesBefore += chapterPages
    }

    return pagesBefore
  }

  private updateStaticPage(currentActualPage: number, totalActualPages: number) {
    const chapter = this.chapterByPath[this.lastPath]
    if (!chapter) return

    const chapterIndex = this.chapters.findIndex((chapter) => {
      return this.formatHref(chapter.href) === this.lastPath
    })
    if (chapterIndex === -1) return

    const pagesBefore = this.getPagesBefore(chapterIndex)

    let pageRatio = 0
    if (totalActualPages > 1) {
      pageRatio = (currentActualPage - 1) / (totalActualPages - 1)
    }

    const wordPositionInChapter = chapter.len * pageRatio
    const currentPageInChapter = Math.max(1, Math.ceil(wordPositionInChapter / STATIC_UNIT))

    this.currentStaticPage = pagesBefore + currentPageInChapter
  }

  private formatHref = (href: string) => {
    return href.split('/').pop()!.split('#')[0]
  }

  private handleLinkClick(href: string) {
    if (href.startsWith('#')) {
      const id = href.substring(1)
      const anchor = this.getHTMLFragment(this.frame.document, id)
      if (anchor) {
        const anchorLeft = anchor.getBoundingClientRect().left
        const win = this.frame.document.defaultView
        if (win) {
          const absoluteLeft = anchorLeft + win.scrollX
          const page = Math.floor(absoluteLeft / this.frame['viewportWidth']) + 1
          this.frame.scrollToPage(page)
        }
      }
      return
    }

    const [basePath, anchor] = href.split('#')

    let targetPath: string | undefined = undefined
    for (let tocItem of this.toc) {
      if (tocItem.href.endsWith(href) || tocItem.href.includes(basePath)) {
        targetPath = tocItem.href
        break
      }
    }

    if (!targetPath) {
      const path = this.formatHref(basePath)
      if (this.chapterByPath[path]) {
        targetPath = basePath + (anchor ? `#${anchor}` : '')
      }
    }

    if (targetPath) {
      this.display(targetPath)
    }
  }

  private getHTMLFragment(doc: Document, id: string) {
    return (
      doc.querySelector(`#${CSS.escape(id)}`) || doc.querySelector(`[name="${CSS.escape(id)}"]`)
    )
  }

  progress(callback: (data: IProgressInfo) => void) {
    this.frame.progress((curr, tot) => {
      const chapter = this.chapterByPath[this.lastPath]
      if (!chapter) {
        callback({
          path: this.lastPath,
          chapterPage: curr,
          chapterTotal: tot,
          current: 1,
          percent: 0,
          total: 1,
        })
        return
      }

      this.updateStaticPage(curr, tot)

      let pageRatio = 0
      if (tot > 1) {
        pageRatio = (curr - 1) / (tot - 1)
      }

      const chapterProgress = chapter.len * pageRatio
      const currentWordPos = chapter.offset + chapterProgress
      const percent = this.totalWords > 0 ? (currentWordPos / this.totalWords) * 100 : 0

      callback({
        percent: Math.min(100, Math.max(0, percent)),
        current: this.currentStaticPage,
        total: this.totalPages,
        path: this.lastPath,
        chapterPage: curr,
        chapterTotal: tot,
      })
    })
  }

  async display(href?: string, lastPage = false) {
    if (!href) {
      const path = this.formatHref(this.chapters[0].href)
      const chapter = this.chapterByPath[path]
      if (!chapter) return

      this.lastPath = path
      await this.frame.loadChapter(chapter.content)
      this.frame.scrollToPage(1)
      this.currentStaticPage = 1
      return
    }

    const [basePath, anchorId] = href.split('#')
    const path = this.formatHref(basePath)
    const chapter = this.chapterByPath[path]

    if (!chapter) {
      console.log(`Chapter not found for path: ${path}`)
      return
    }

    const isNewChapter = this.lastPath !== path

    if (isNewChapter) {
      this.lastPath = path
      await this.frame.loadChapter(chapter.content)
    }

    let targetPage = 1

    if (lastPage) {
      targetPage = this.frame.getTotalPages()
      const chapterIndex = this.chapters.findIndex((c) => this.formatHref(c.href) === this.lastPath)
      const pagesBefore = this.getPagesBefore(chapterIndex)
      const chapterStaticPages = Math.max(1, Math.ceil(chapter.len / STATIC_UNIT))
      this.currentStaticPage = pagesBefore + chapterStaticPages
    } else if (anchorId) {
      this.updateStaticPage(targetPage, this.frame.getTotalPages())
    } else if (isNewChapter) {
      const chapterIndex = this.chapters.findIndex((c) => this.formatHref(c.href) === this.lastPath)
      this.currentStaticPage = this.getPagesBefore(chapterIndex) + 1
    }

    this.frame.scrollToPage(targetPage)
  }

  async loadProgress(progress: Progress) {
    const [chapterHref, page] = progress

    const path = this.formatHref(chapterHref)
    const chapter = this.chapterByPath[path]

    if (!chapter) {
      await this.display()
      return
    }

    this.lastPath = path
    await this.frame.loadChapter(chapter.content)

    this.frame.scrollToPage(+page)
    this.updateStaticPage(+page, this.frame.getTotalPages())
  }

  nextPage() {
    if (this.frame.getCurrentPage() < this.frame.getTotalPages()) {
      this.frame.scrollToPage(this.frame.getCurrentPage() + 1)
    } else {
      this.nextChapter()
    }
  }

  prevPage() {
    if (this.frame.getCurrentPage() > 1) {
      this.frame.scrollToPage(this.frame.getCurrentPage() - 1)
    } else {
      this.prevChapter(true)
    }
  }

  async nextChapter() {
    const idx = this.chapters.findIndex((c) => this.formatHref(c.href) === this.lastPath)
    if (idx !== -1 && this.chapters[idx + 1]) {
      await this.display(this.chapters[idx + 1].href)
    }
  }

  async prevChapter(toLast = false) {
    const idx = this.chapters.findIndex((c) => this.formatHref(c.href) === this.lastPath)
    if (idx !== -1 && this.chapters[idx - 1]) {
      await this.display(this.chapters[idx - 1].href, toLast)
    }
  }

  setStyles(s: ISettingsState) {
    this.frame.setStyles(s)
  }

  renderTo(s: string) {
    this.frame.attachTo(s)
  }

  destroy() {
    this.frame.destroy()
  }

  public getTotalPagesCount(): number {
    return this.totalPages
  }

  public getCurrentStaticPage(): number {
    return this.currentStaticPage
  }
}
