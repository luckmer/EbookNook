export const setStylesImportant = (el: HTMLElement, styles: Record<string, string>) => {
  Object.entries(styles).forEach(([k, v]) => el.style.setProperty(k, v, 'important'))
}
