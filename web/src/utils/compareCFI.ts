import * as CFI from '@foliate/epubcfi.js'

export const isActiveCFI = (cfi: string, location: string): boolean => {
  try {
    return (
      CFI.compare(cfi, CFI.collapse(location)) >= 0 &&
      CFI.compare(cfi, CFI.collapse(location, true)) <= 0
    )
  } catch (err) {
    console.log('Failed to compare CFI', { cfi, location, error: err })
    return false
  }
}
