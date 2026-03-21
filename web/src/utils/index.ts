import { Toc } from '@bindings/epub'
import { IAnnotation, IGetNodeContent } from '@libs/AnchorContent'
import {
  COMMA_REGEX,
  DOUBLE_QUOTES_REGEX,
  ELLIPSIS_REGEX,
  QUOTES_REGEX,
  SPACE_REGEX,
} from './regex'

export const rstr2hex = (input: string) => {
  const hex_tab = '0123456789abcdef'
  let output = ''
  for (let i = 0; i < input.length; i++) {
    const x = input.charCodeAt(i)
    output += hex_tab[(x >>> 4) & 0x0f] + hex_tab[x & 0x0f]
  }
  return output
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const flatData = (data: Toc[], level = 0, el: Toc[] = []): Toc[] => {
  for (let item of data) {
    el.push(item)
    if (item.subitems.length > 0) {
      flatData(item.subitems, level + 1, el)
    }
  }
  return el
}

export const formatDate = (value: string) => {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 2) return numbers
  if (numbers.length <= 4) return `${numbers.slice(0, 2)}-${numbers.slice(2)}`
  return `${numbers.slice(0, 2)}-${numbers.slice(2, 4)}-${numbers.slice(4, 8)}`
}

export const trimText = (maxSize: number) => {
  return (text: string) => {
    return text.length > maxSize ? `${text.slice(0, maxSize)}...` : text
  }
}

export const normalizeText = (text: string) => {
  return text
    .replace(SPACE_REGEX, ' ')
    .replace(COMMA_REGEX, '$1')
    .replace(ELLIPSIS_REGEX, '...')
    .replace(QUOTES_REGEX, "'")
    .replace(DOUBLE_QUOTES_REGEX, '"')
    .trim()
}

export const buildAnnotation = (
  range: Range,
  nodeContent: IGetNodeContent,
  text: string,
): IAnnotation | null => {
  const contentFrom = range.startContainer.textContent
  const contentTo = range.endContainer.textContent

  if (!contentFrom || !contentTo) return null

  const anchorTextNode = nodeContent.textNodes.find((n) => n.node === range.startContainer)
  const focusTextNode = nodeContent.textNodes.find((n) => n.node === range.endContainer)

  if (!anchorTextNode || !focusTextNode) return null

  const normStart =
    anchorTextNode.start + normalizeText(contentFrom.slice(0, range.startOffset)).length
  const normEnd = focusTextNode.start + normalizeText(contentTo.slice(0, range.endOffset)).length

  return {
    text,
    normStart: Math.min(normStart, normEnd),
    normEnd: Math.max(normStart, normEnd),
  }
}

export const getNodeContentWalker = (doc: Document) => {
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT)
  const textNodes = []

  let normFullText = ''

  while (true) {
    const node = walker.nextNode()
    if (!node) break

    const norm = normalizeText(node.textContent ?? '')
    if (!norm) continue

    const range = doc.createRange()
    range.setStart(node, 0)
    range.setEnd(node, node.textContent?.length ?? 0)
    const rects = range.getClientRects()

    textNodes.push({
      end: normFullText.length + norm.length,
      start: normFullText.length,
      rects: Array.from(rects).map((rect) => {
        return {
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom,
        }
      }),
      node,
    })

    normFullText += norm + ' '
  }

  return { normFullText, textNodes }
}
