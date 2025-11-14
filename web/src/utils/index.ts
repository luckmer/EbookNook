export const rstr2hex = (input: string) => {
  const hex_tab = '0123456789abcdef'
  let output = ''
  for (let i = 0; i < input.length; i++) {
    const x = input.charCodeAt(i)
    output += hex_tab[(x >>> 4) & 0x0f] + hex_tab[x & 0x0f]
  }
  return output
}
