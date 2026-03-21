import { Frame } from '@libs/Frame/FrameCore'
import { getNodeContentWalker } from '@utils/index'

export interface ITextNode {
  rects: {
    left: number
    right: number
    top: number
    bottom: number
  }[]
  end: number
  start: number
  node: Node
}

export interface IGetNodeContent {
  textNodes: Array<ITextNode>
  normFullText: string
}

export interface IAnnotation {
  text: string
  normStart: number
  normEnd: number
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

  async anchor(annotation: IAnnotation): Promise<void> {
    this.observer?.disconnect()
    this.unAnchor()

    const frame = this.frame
    if (!frame) return

    const container = frame.document?.defaultView?.frameElement
    if (!container) return

    const doc = frame.document
    if (!doc) return

    const nodeContent = getNodeContentWalker(doc)

    const content = this.highlightAnchorText(
      annotation.normStart,
      annotation.normEnd,
      doc,
      nodeContent,
    )
    if (!content) return

    this.observer = new ResizeObserver(() => this.handleWatchContentPosition(content))
    this.observer.observe(container)
  }

  private highlightAnchorText(
    matchStart: number,
    matchEnd: number,
    doc: Document,
    nodeContent: IGetNodeContent,
  ): HTMLElement | null {
    const nodes = nodeContent.textNodes.filter(
      ({ start, end }) => end >= matchStart && start < matchEnd,
    )

    if (!nodes.length) return null

    let firstMark: HTMLElement | null = null

    nodes.forEach((node) => {
      const textContent = node.node.textContent ?? ''
      const start = Math.min(Math.max(matchStart, node.start) - node.start, textContent.length)
      const end = Math.min(Math.min(matchEnd, node.end + 1) - node.start, textContent.length)
      const lastStart = start === end ? Math.max(0, start - 1) : start

      const matched = textContent.slice(lastStart, end)
      if (!matched) return

      const parent = node.node.parentNode
      if (!parent) return

      const mark = doc.createElement('mark')
      mark.dataset.annotationKey = `${matchStart}-${matchEnd}`
      mark.style.background = '#4da3ff59'
      mark.style.color = '#fff'
      mark.textContent = matched

      parent.insertBefore(doc.createTextNode(textContent.slice(0, lastStart)), node.node)
      parent.insertBefore(mark, node.node)
      parent.insertBefore(doc.createTextNode(textContent.slice(end)), node.node)
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
