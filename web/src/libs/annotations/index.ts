import { getEventEmitter } from '@libs/eventEmitter'

export class Annotations {
  private eventListeners: Array<{ target: EventTarget; type: string; handler: EventListener }> = []
  private popupClass: string = '.annotator-popup'
  private eventEmitter = getEventEmitter()
  private iframe: HTMLIFrameElement
  private doc: Document

  constructor(doc: Document, iframe: HTMLIFrameElement) {
    this.iframe = iframe
    this.doc = doc
    this.init()
  }

  private clearSelection() {
    const selection = this.doc.getSelection()
    if (selection) {
      selection.removeAllRanges()
    }
  }

  private handleAnnotationClick(selection: Selection) {
    this.eventEmitter.dispatch('annotationClick', {
      selected: selection,
      doc: this.doc,
      iframe: this.iframe,
    })
  }

  private handleAnnotationMouseDown() {
    this.eventEmitter.dispatch('restartAnnotator')
  }

  private handleMouseUp = (e: Event) => {
    e.stopPropagation()
    const selection = this.doc.getSelection()

    if (selection && !selection.isCollapsed && selection.toString().trim()) {
      this.handleAnnotationClick(selection)
    }
  }

  private handleDocMouseDown = (e: Event) => {
    e.stopPropagation()
    this.handleAnnotationMouseDown()
  }

  private handleWindowMouseDown = (e: Event) => {
    const target = (e as MouseEvent).target as HTMLElement
    if (target?.closest(this.popupClass)) {
      return
    }

    e.stopPropagation()
    this.clearSelection()
    this.handleAnnotationMouseDown()
  }

  private handleWindowResize = (e: Event) => {
    e.stopPropagation()
    this.clearSelection()
    this.handleAnnotationMouseDown()
  }

  private addEventListener(target: EventTarget, type: string, handler: EventListener) {
    target.addEventListener(type, handler)
    this.eventListeners.push({ target, type, handler })
  }

  private init() {
    this.addEventListener(this.doc, 'mousedown', this.handleDocMouseDown)
    this.addEventListener(this.doc, 'mouseup', this.handleMouseUp)
    this.addEventListener(window, 'mousedown', this.handleWindowMouseDown)
    this.addEventListener(window, 'resize', this.handleWindowResize)
  }

  destroy() {
    this.eventListeners.forEach(({ target, type, handler }) => {
      target.removeEventListener(type, handler)
    })
    this.eventListeners = []
  }
}
