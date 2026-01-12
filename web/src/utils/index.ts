import { Toc } from '@bindings/epub'

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
