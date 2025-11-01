import JSZip from 'jszip'

class EpubApiClientProvider {
  file: File

  constructor(file: File) {
    this.file = file
  }

  async getArrayBuffer(file: File) {
    const arrayBuffer = await file.arrayBuffer()

    return arrayBuffer
  }

  async _loadFile() {
    const arrayBuffer = await this.getArrayBuffer(this.file)
    const zip = await JSZip.loadAsync(arrayBuffer)
    console.log('zip', zip)
  }
}

export default EpubApiClientProvider
