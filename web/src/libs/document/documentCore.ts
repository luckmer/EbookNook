import { FormatType } from '@bindings/format'
import { ILocalBookType } from '@interfaces/book/types'
import { rstr2hex } from '@utils/index'

export default class DocumentClientCore {
  fetchFile = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`, { cause: res })
    return new File([await res.blob()], new URL(res.url).pathname)
  }

  isFBZ = ({ name, type }: { name: string; type: string }) =>
    type === 'application/x-zip-compressed-fb2' ||
    name.endsWith('.fb2.zip') ||
    name.endsWith('.fbz')

  isFB2 = ({ name, type }: { name: string; type: string }) =>
    type === 'application/x-fictionbook+xml' || name.endsWith('.fb2')

  isCBZ = ({ name, type }: { name: string; type: string }) =>
    type === 'application/vnd.comicbook+zip' || name.endsWith('.cbz')

  makeZipLoader = async (file: File) => {
    const { configure, ZipReader, BlobReader, TextWriter, BlobWriter } =
      await import('@foliate/vendor/zip.js')

    configure({ useWebWorkers: false })
    const reader = new ZipReader(new BlobReader(file))
    const entries = await reader.getEntries()

    type ZipEntry = (typeof entries)[number]
    type Loader<T> = (name: string, ...args: unknown[]) => T | null

    const map = new Map<string, ZipEntry>(
      entries.map((entry: { filename: string }) => [entry.filename, entry]),
    )

    const load =
      <T>(f: (entry: ZipEntry, ...args: unknown[]) => T): Loader<T> =>
      (name, ...args) =>
        map.has(name) ? f(map.get(name)!, ...args) : null

    const loadText: Loader<Promise<string>> = load((entry) => entry.getData(new TextWriter()))
    const loadBlob: Loader<Promise<Blob>> = load((entry, type) =>
      entry.getData(new BlobWriter(type as string)),
    )
    const getSize = (name: string): number => map.get(name)?.uncompressedSize ?? 0

    return { entries, loadText, loadBlob, getSize }
  }

  isZip = async (file: File) => {
    const arr = new Uint8Array(await file.slice(0, 4).arrayBuffer())
    return arr[0] === 0x50 && arr[1] === 0x4b && arr[2] === 0x03 && arr[3] === 0x04
  }

  isPDF = async (file: File) => {
    const arr = new Uint8Array(await file.slice(0, 5).arrayBuffer())
    return (
      arr[0] === 0x25 && arr[1] === 0x50 && arr[2] === 0x44 && arr[3] === 0x46 && arr[4] === 0x2d
    )
  }

  async _makeBook(file: File) {
    const { makeBook } = await import('@foliate/view.js')
    return makeBook(file)
  }

  private async loadBook(file: File) {
    let format: FormatType | null = null
    if (await this.isPDF(file)) {
      format = 'PDF'
    }

    if (this.isFB2(file)) {
      format = 'FB2'
    }

    if (await this.isZip(file)) {
      if (this.isCBZ(file)) {
        format = 'CBZ'
      }

      if (this.isFBZ(file)) {
        format = 'FBZ'
      }

      format = 'EPUB'
    }

    if (format === null) {
      const { isMOBI } = await import('@foliate/mobi.js')
      if (await isMOBI(file)) {
        format = 'MOBI'
      }
    }

    if (format === null) {
      throw new Error('File type not supported')
    }

    const book = await this._makeBook(file)

    return {
      ...book,
      async getCover() {
        let cover

        if (format === 'EPUB') {
          cover = book.resources?.cover
        }

        if (format === 'MOBI') {
          const cover = await book.getCover()
          return cover
        }

        return cover?.href
          ? new Blob([await this.loadBlob(cover.href)], { type: cover.mediaType })
          : null
      },
      id: rstr2hex(Date.now().toString()),
      percentageProgress: '',
      progress: [],
      format,
    }
  }

  async _init(file: File): Promise<ILocalBookType> {
    if (typeof file === 'string') file = await this.fetchFile(file)
    if (!file.size) throw new Error('File not found')

    const book = await this.loadBook(file)
    if (!book) throw new Error('File type not supported')
    return book
  }
}
