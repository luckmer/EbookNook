import { FormatType } from '@bindings/format'
import { appDataDir, join } from '@tauri-apps/api/path'
import { exists, mkdir, readDir, readFile, remove, writeFile } from '@tauri-apps/plugin-fs'

export class AppServiceCore {
  appName: string = 'eBookNook'
  appDataDir: string | null = null
  private readonly MIME_MAP: Record<FormatType, string> = {
    EPUB: 'application/epub+zip',
    PDF: 'application/pdf',
    MOBI: 'application/x-mobipocket-ebook',
    FB2: 'application/x-fictionbook+xml',
    FBZ: 'application/x-zip-compressed-fb2',
    CBZ: 'application/vnd.comicbook+zip',
    ZIP: 'application/zip',
    AZW: 'application/vnd.amazon.ebook',
    AZW3: 'application/vnd.amazon.mobi8-ebook',
  }

  async getAppDataDir(): Promise<string> {
    if (!this.appDataDir) {
      this.appDataDir = await appDataDir()
    }
    return this.appDataDir
  }

  async getLibraryDir(bookId: string): Promise<string> {
    const dataDir = await this.getAppDataDir()
    const booksDir = await join(dataDir, this.appName, bookId)

    if (!(await exists(booksDir))) {
      await mkdir(booksDir, { recursive: true })
    }
    return booksDir
  }

  async _saveBookToStorage(file: File, bookId: string): Promise<string> {
    const booksDir = await this.getLibraryDir(bookId)

    const originalExt = file.name.split('.').pop()?.toLowerCase()
    const extension = originalExt && originalExt.length < 5 ? originalExt : 'epub'

    const destPath = await join(booksDir, `${bookId}.${extension}`)
    const buffer = await file.arrayBuffer()

    await writeFile(destPath, new Uint8Array(buffer))
    return destPath
  }

  async _loadBookFromStorage(bookId: string): Promise<File> {
    const booksDir = await this.getLibraryDir(bookId)
    const entries = await readDir(booksDir)

    const bookEntry = entries.find((e) => e.name.startsWith(bookId))

    if (!bookEntry) {
      throw new Error(`Book with ID ${bookId} not found on disk`)
    }

    const filePath = await join(booksDir, bookEntry.name)
    const bytes = await readFile(filePath)

    const ext = bookEntry.name.split('.').pop()?.toUpperCase() as FormatType
    const mimeType = this.MIME_MAP[ext] || 'application/octet-stream'

    return new File([bytes], bookEntry.name, { type: mimeType })
  }

  async saveCover(bookId: string, coverBlob: Blob | null) {
    if (!coverBlob) return
    const coversDir = await this.getLibraryDir(bookId)

    const fileName = `${bookId}.png`
    const destPath = await join(coversDir, fileName)

    const buffer = await coverBlob.arrayBuffer()
    await writeFile(destPath, new Uint8Array(buffer))
  }

  async _loadCoverDir(bookId: string) {
    const coversDir = await this.getLibraryDir(bookId)

    return coversDir
  }

  async _getCover(bookId: string) {
    const coversDir = await this.getLibraryDir(bookId)
    return `${coversDir}/${bookId}.png`
  }

  async _deleteBookFromStorage(bookId: string) {
    const dataDir = await this.getAppDataDir()
    const booksDir = await join(dataDir, this.appName, bookId)

    const exist = await exists(booksDir)
    if (!exist) return

    await remove(booksDir, { recursive: true })
  }
}
