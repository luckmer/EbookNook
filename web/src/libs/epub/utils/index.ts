export class EpubUtils {
  static arrayBufferToBinaryString(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let str = ''

    const chunk = 0x8000
    for (let i = 0; i < bytes.length; i += chunk) {
      str += String.fromCharCode(...bytes.subarray(i, i + chunk))
    }
    return str
  }

  static binaryStringToArrayBuffer(str: string): ArrayBuffer {
    const buf = new ArrayBuffer(str.length)
    const bytes = new Uint8Array(buf)
    for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i)
    return buf
  }

  static parseXml(xml: string, mime: DOMParserSupportedType): Document {
    return new DOMParser().parseFromString(xml, mime)
  }
}
