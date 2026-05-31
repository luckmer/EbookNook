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

export const formatDate = (value: string) => {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 2) return numbers
  if (numbers.length <= 4) return `${numbers.slice(0, 2)}-${numbers.slice(2)}`
  return `${numbers.slice(0, 2)}-${numbers.slice(2, 4)}-${numbers.slice(4, 8)}`
}
