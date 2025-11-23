import JSZip from 'jszip'
import { EpubUtils } from '../utils'
import { MIME } from './static'
import { IXML } from '@interfaces/book/interfaces'
export class ZipParser {
  async load(buffer: ArrayBuffer): Promise<IXML> {
    const zip = await JSZip.loadAsync(buffer)

    const containerXml = await zip.file('META-INF/container.xml')?.async('text')
    if (!containerXml) throw new Error('META-INF/container.xml not found')

    const containerDoc = EpubUtils.parseXml(containerXml, MIME.XML)
    const rootFilePath = containerDoc.querySelector('rootfile')?.getAttribute('full-path')
    if (!rootFilePath) throw new Error('OPF path not found')

    const opfText = await zip.file(rootFilePath)?.async('text')
    if (!opfText) throw new Error('OPF not found')

    const basePath = rootFilePath.substring(0, rootFilePath.lastIndexOf('/') + 1)

    return {
      rootFilePath: EpubUtils.arrayBufferToBinaryString(buffer),
      filePath: rootFilePath,
      basePath,
      doc: EpubUtils.parseXml(opfText, MIME.XML),
      zip,
    }
  }
}
