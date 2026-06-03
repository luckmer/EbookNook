import { describe, expect, test } from 'vitest'
import { isActiveCFI } from '../compareCFI'

describe('isActiveCFI', () => {
  test('returns true when CFI is within location range', () => {
    const firstPage =
      'epubcfi(/6/12!/4/2/2[tagalog],/2[rw-title-block_43539-077535482],/50[rw-p_43542-799917896]/1:119)'

    const readerLocation =
      'epubcfi(/6/12!/4/2/2[tagalog],/2[rw-title-block_43539-077535482],/42[rw-p_43542-151052214]/1:283)'

    expect(isActiveCFI(firstPage, readerLocation)).toBe(true)
  })

  test('Should return false when CFI does not match location', () => {
    const firstPage =
      'epubcfi(/6/12!/4/2/2[tagalog],/2[rw-title-block_43539-077535482],/50[rw-p_43542-799917896]/1:119)'

    const contentPage =
      'epubcfi(/6/10!/4/2/2[maori],/128[rw-p_44141-803487614]/1:289,/178[rw-p_44141-978689472]/1:185)'

    expect(isActiveCFI(firstPage, contentPage)).toBe(false)
  })

  test('returns true when comparing a CFI against itself', () => {
    const contentPage =
      'epubcfi(/6/10!/4/2/2[maori],/128[rw-p_44141-803487614]/1:289,/178[rw-p_44141-978689472]/1:185)'

    expect(isActiveCFI(contentPage, contentPage)).toBe(true)
  })

  test('Should return false when CFI points to a different spine', () => {
    const cfi =
      'epubcfi(/6/12!/4/2/2[tagalog],/2[rw-title-block_43539-077535482],/50[rw-p_43542-799917896]/1:119)'

    const differentSpine =
      'epubcfi(/6/14!/4/2/2[tagalog],/2[rw-title-block_43539-077535482],/50[rw-p_43542-799917896]/1:119)'

    expect(isActiveCFI(cfi, differentSpine)).toBe(false)
  })

  test('Should return true when CFI is in the middle of a range', () => {
    const rangeLocation =
      'epubcfi(/6/10!/4/2/2[maori],/128[rw-p_44141-803487614]/1:289,/178[rw-p_44141-978689472]/1:185)'

    const midRangeCFI = 'epubcfi(/6/10!/4/2/2[maori],/150[rw-p_44141-500000000]/1:0)'

    expect(isActiveCFI(midRangeCFI, rangeLocation)).toBe(true)
  })
})
