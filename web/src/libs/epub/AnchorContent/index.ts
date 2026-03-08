import { Frame } from '@libs/Frame/FrameCore'
import { normalizeText } from '@utils/index'

export interface ITextNode {
  end: number
  start: number
  node: Node
}

export interface IGetNodeContent {
  textNodes: Array<ITextNode>
  normFullText: string
}

export class AnchorContent {
  observer: ResizeObserver | undefined = undefined
  frame: Frame | undefined = undefined
  marks: Array<HTMLElement> = []

  init(frame: Frame) {
    this.frame = frame
  }

  handleWatchContentPosition(content: HTMLElement): void {
    const frame = this.frame
    if (!frame) return

    const elPosition = content.getBoundingClientRect()
    const targetPage = Math.floor(elPosition.left / frame.viewportWidth) + 1
    frame.scrollToPage(targetPage)
  }

  async anchor(text: string): Promise<void> {
    this.observer?.disconnect()
    this.unAnchor()

    const frame = this.frame
    if (!frame) return

    const container = frame.document?.defaultView?.frameElement
    if (!container) return

    const content = this.highlightAnchorText(text)
    if (!content) return

    this.observer = new ResizeObserver(() => this.handleWatchContentPosition(content))
    this.observer.observe(container)
  }

  getNodeContent(doc: Document): IGetNodeContent {
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT)
    const textNodes: Array<ITextNode> = []

    let normFullText = ''

    while (true) {
      const node = walker.nextNode()
      if (!node) break

      const norm = normalizeText(node.textContent ?? '')
      if (!norm) continue

      textNodes.push({
        end: normFullText.length + norm.length,
        start: normFullText.length,
        node,
      })

      normFullText += norm + ' '
    }

    return { normFullText, textNodes }
  }

  highlightAnchorText(text: string): HTMLElement | null {
    const frame = this.frame
    if (!frame) return null

    const doc = frame.document
    if (!doc?.body) return null

    const nodeContent = this.getNodeContent(doc)
    const normalizedSearch = normalizeText(text)

    const matchStart = normalizeText(nodeContent.normFullText).indexOf(normalizedSearch)
    const matchEnd = matchStart + normalizedSearch.length

    const nodes = nodeContent.textNodes.filter(
      ({ start, end }) => end > matchStart && start < matchEnd,
    )

    let firstMark: HTMLElement | null = null

    nodes.forEach((node) => {
      const sliceStart = Math.max(matchStart, node.start) - node.start
      const sliceEnd = Math.min(matchEnd, node.end) - node.start
      const textContent = node.node.textContent ?? ''

      const safeStart = Math.min(sliceStart, textContent.length)
      const safeEnd = Math.min(sliceEnd, textContent.length)

      const matched = textContent.slice(safeStart, safeEnd)
      const before = textContent.slice(0, safeStart)
      const after = textContent.slice(safeEnd)

      const mark = doc.createElement('mark')
      mark.style.background = '#4da3ff59'
      mark.style.color = '#fff'
      mark.textContent = matched

      const parent = node.node.parentNode
      if (!parent) return

      parent.insertBefore(doc.createTextNode(before), node.node)
      parent.insertBefore(mark, node.node)
      parent.insertBefore(doc.createTextNode(after), node.node)
      parent.removeChild(node.node)

      if (!firstMark) {
        firstMark = mark
      }

      this.marks.push(mark)
    })

    return firstMark
  }

  unAnchor(): void {
    this.observer?.disconnect()
    this.observer = undefined

    this.marks.forEach((mark) => {
      mark.replaceWith(...Array.from(mark.childNodes))
      mark.parentNode?.normalize()
    })

    this.marks = []
  }
}
