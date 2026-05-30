export type IHandler = {
  mouseUp: (e: MouseEvent) => void
  mouseDown: (e: MouseEvent) => void
  resize: (e: UIEvent) => void
}

export const getFoliateDocEvents = (doc: Document, handler: IHandler) => {
  doc.addEventListener('mouseup', handler.mouseUp)
  doc.addEventListener('mousedown', handler.mouseDown)
  window.addEventListener('resize', handler.resize)
}
