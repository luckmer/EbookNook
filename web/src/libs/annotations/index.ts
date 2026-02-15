import { getEventEmitter } from '@libs/eventEmitter'

export class Annotations {
  eventEmitter = getEventEmitter()
  iframe: HTMLIFrameElement
  doc: Document

  constructor(doc: Document, iframe: HTMLIFrameElement) {
    this.iframe = iframe
    this.doc = doc

    this.init()
  }

  handleAnnotationClick(selected: Selection) {
    this.eventEmitter.dispatch('annotationClick', { selected, doc: this.doc, iframe: this.iframe })
  }

  handleAnnotationMouseDown() {
    this.eventEmitter.dispatch('annotationMouseDown')
  }

  init() {
    this.doc.addEventListener('mousedown', (e) => {
      e.stopPropagation()
      this.handleAnnotationMouseDown()
    })

    this.doc.addEventListener('mouseup', (e) => {
      e.stopPropagation()
      const selection = this.doc.getSelection()

      if (selection && !selection.isCollapsed && selection.toString().trim()) {
        this.eventEmitter.dispatch('annotationClick', {
          selected: selection,
          doc: this.doc,
          iframe: this.iframe,
        })
      }
    })
  }
}
