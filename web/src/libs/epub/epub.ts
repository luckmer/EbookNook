import { Frame } from '@libs/Frame/FrameCore'
import { EpubContentParser } from './lib/chapters'
import { ZipParser } from './lib/zipParser'
import { ISettingsState } from '@interfaces/settings/interfaces'
import { EpubTocParser } from './lib/toc'
import { Chapter, Progress, Toc } from '@bindings/epub'
import { Epub as IEpub } from '@bindings/epub'
import { flatData } from '@utils/index'
export interface IEpubChapter extends Chapter {
  chapterIndex: number
}

export class Epub {
  contentParser = new EpubContentParser()
  zipParser = new ZipParser()
  EpubTocParser = new EpubTocParser()
  frame = new Frame()
  currentPage: string = ''
  chapters: IEpubChapter[] = []
  bookProgress: Progress = ['', '']
  chapterByHref: Record<string, Chapter> = {}
  chapterByIndex: Record<string, number> = {}
  lastSelectedPath: string = ''
  toc: Toc[] = []
  book: IEpub

  constructor(book: IEpub) {
    this.chapters = []
    this.book = book

    this.loadChapters()
    this.frame.onLinkClick((href) => this.handleFrameLink(href))
  }

  private handleFrameLink(href: string) {
    let path: string | undefined = undefined
    for (let toc of this.toc) {
      if (toc.href.endsWith(href)) {
        path = toc.href
        break
      }
    }

    if (!path) return
    this.loadNextChapter(path)
  }

  renderTo(element: string) {
    this.frame.attachTo(element)
  }

  setStyles(settings: ISettingsState) {
    this.frame.setStyles(settings)
  }

  formatChapterHref(href: string) {
    const base = href.split('/')
    return base[base.length - 1]
  }

  loadChapters() {
    this.chapters = this.book.chapters.map((chapter, index) => ({
      ...chapter,
      chapterIndex: index,
    }))

    for (let chapter of this.chapters) {
      const href = this.formatChapterHref(chapter.href)
      this.chapterByHref[href] = chapter
      this.chapterByIndex[href] = chapter.chapterIndex
    }

    this.toc = flatData(this.book.toc)
  }

  getHTMLFragment = (doc: Document, id: string) => {
    return (
      doc.querySelector(`#${CSS.escape(id)}`) || doc.querySelector(`[name="${CSS.escape(id)}"]`)
    )
  }

  getAnchorProgress(anchor?: Element | null) {
    if (!anchor) return 0
    return anchor.getBoundingClientRect().left
  }

  isContentEmpty(href?: string) {
    return !(href ?? '').trim().length
  }

  loadNextChapter(href: string) {
    const [basePath, hash] = href.split('#')
    const path = this.formatChapterHref(basePath)

    if (this.lastSelectedPath !== path) {
      const chapter = this.chapterByHref[path]

      if (!chapter) return
      this.frame.loadChapter(chapter.content)
      this.lastSelectedPath = path
    }

    const doc = this.frame.document
    const anchor = hash ? this.getHTMLFragment(doc, hash) : undefined
    const tocProgress = this.getAnchorProgress(anchor)

    console.log(href, tocProgress)
    this.frame.goTo(tocProgress)
  }

  progress(callback: (current: number, total: number) => void) {
    this.frame.progress(callback)
  }

  loadFirstChapter() {
    this.lastSelectedPath = this.formatChapterHref(this.chapters[0].href)
    this.frame.loadChapter(this.chapters[0].content)
  }

  display(href?: string) {
    if (this.isContentEmpty(href)) {
      this.loadFirstChapter()
      return
    }

    if (typeof href !== 'undefined') {
      this.loadNextChapter(href)
    }
  }

  nextPage() {
    if (this.frame.canGoNext()) {
      this.frame.nextPage()
    } else {
      this.nextChapter()
    }
  }

  prevPage() {
    if (this.frame.canGoPrev()) {
      this.frame.prevPage()
    } else {
      this.prevChapter()
    }
  }

  getBookProgress() {
    return this.bookProgress
  }

  nextChapter() {
    const index = this.chapterByIndex[this.lastSelectedPath] + 1
    const chapter = this.chapters[index]

    if (!chapter) return

    this.loadNextChapter(chapter.href)
  }

  prevChapter() {
    const index = this.chapterByIndex[this.lastSelectedPath] - 1
    const chapter = this.chapters[index]

    if (!chapter) return
    this.loadNextChapter(chapter.href)
  }

  destroyFrameCore() {
    this.frame.destroy()
  }
}
