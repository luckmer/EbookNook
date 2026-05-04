import { FormatType } from '@bindings/format'
import { IBindingsPDFToc } from '@bindings/pdf'

export interface IPDFMetadata {
  author?: string
  contributor?: string
  description: string
  identifier?: string
  language?: string
  publisher?: string
  rights?: string
  source?: string
  modfied?: string
  subject?: string
  title?: string
}

export interface IZoomEvent {
  doc: Document
  scale: number
}

interface IPDFRenderedPage {
  src: string
  onZoom: (event: IZoomEvent) => Promise<void>
}

export interface IPDFSections {
  id: number
  load: () => Promise<IPDFRenderedPage>
  size: number
}

export interface IPDFBookFile {
  format: FormatType
  metadata: IPDFMetadata
  toc?: IBindingsPDFToc[]
  percentageProgress: string
  progress: Record<string, string>
  sections: any[]
  id: string
}

export interface IPDFBook extends IPDFBookFile {
  format: 'PDF'
  getCover(): Promise<Blob | null>
}
