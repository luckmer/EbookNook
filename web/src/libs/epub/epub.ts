import { Frame } from '@libs/Frame/FrameCore'
import { EpubContentParser } from './lib/chapters'
import { ZipParser } from './lib/zipParser'
import { ISettingsState } from '@interfaces/settings/interfaces'
import { EpubTocParser } from './lib/toc'
import { Chapter, Progress, Toc } from '@bindings/epub'
export interface IEpubChapter extends Chapter {
  index: number
}

export class Epub {
  contentParser = new EpubContentParser()
  zipParser = new ZipParser()
  EpubTocParser = new EpubTocParser()
  frame = new Frame()
  url: string = ''
  currentPage: string = ''
  chapters: IEpubChapter[] = []
  bookProgress: Progress = ['', '']
  chapterByHref: Record<string, Chapter> = {}
  chapterByIndex: Record<string, number> = {}
  lastSelectedPath: string = ''
  isLoading: boolean = false
  toc: Toc[] = []
  private queue: Promise<void>

  private enqueue(action: () => Promise<void>) {
    this.queue = this.queue.then(() => action()).catch(console.error)
    return this.queue
  }

  constructor(url: string) {
    this.url = url
    this.chapters = []
    this.isLoading = true

    this.queue = Promise.resolve()

    this.enqueue(() => this.loadChapters())
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
    return this.enqueue(async () => {
      await this.frame.attachTo(element)
    })
  }

  setStyles(settings: ISettingsState) {
    return this.enqueue(async () => {
      return this.frame.setStyles(settings)
    })
  }

  formatChapterHref(href: string) {
    const base = href.split('/')
    return base[base.length - 1]
  }

  async loadChapters() {
    this.isLoading = true

    // try {
    //   const buffer = EpubUtils.binaryStringToArrayBuffer(this.url)

    //   const xml = await this.zipParser.load(buffer)
    //   const [tocData, contentData] = await Promise.all([
    //     this.EpubTocParser.parse(xml),
    //     this.contentParser.parse(xml),
    //   ])

    //   const { chapters } = contentData

    //   this.chapters = chapters.map((chapter, index) => ({
    //     ...chapter,
    //     index,
    //   }))

    // for (let chapter of this.chapters) {
    //   const href = this.formatChapterHref(chapter.href)
    //   this.chapterByHref[href] = chapter
    //   this.chapterByIndex[href] = chapter.index
    // }

    //   this.toc = flatData(tocData)
    // } catch (err) {
    //   throw err
    // } finally {
    //   this.isLoading = false
    // }
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
    return this.enqueue(async () => {
      new Promise<void>((resolve) => {
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
        resolve()
      })
    })
  }

  progress(callback: (current: number, total: number) => void) {
    this.frame.progress(callback)
  }

  loadFirstChapter() {
    return this.enqueue(async () => {
      this.lastSelectedPath = this.formatChapterHref(this.chapters[0].href)
      await this.frame.loadChapter(this.chapters[0].content)
    })
  }

  async display(href?: string) {
    if (this.isContentEmpty(href)) {
      await this.loadFirstChapter()
      return
    }

    if (typeof href !== 'undefined') {
      await this.loadNextChapter(href)
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
    this.enqueue(async () => {
      new Promise<void>((resolve) => {
        const index = this.chapterByIndex[this.lastSelectedPath] + 1
        const chapter = this.chapters[index]

        if (!chapter) return

        this.loadNextChapter(chapter.href)
        resolve()
      })
    })
  }

  prevChapter() {
    this.enqueue(async () => {
      new Promise<void>((resolve) => {
        const index = this.chapterByIndex[this.lastSelectedPath] - 1
        const chapter = this.chapters[index]

        if (!chapter) return
        this.loadNextChapter(chapter.href)
        resolve()
      })
    })
  }

  destroyFrameCore() {
    this.frame.destroy()
  }
}
