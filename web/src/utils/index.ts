import { Toc } from '@bindings/epub'
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
