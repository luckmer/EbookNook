import { createStoreSelectors } from '@store/helper'
import { store } from '@store/reducers/settings'
import { createSelector } from 'reselect'

export const settingsSelector = createStoreSelectors(store)

export const settingsConfig = createSelector(
  settingsSelector.defaultFontSize,
  settingsSelector.fontWeight,
  settingsSelector.wordSpacing,
  settingsSelector.letterSpacing,
  settingsSelector.textIndent,
  settingsSelector.lineHeight,
  (defaultFontSize, fontWeight, wordSpacing, letterSpacing, textIndent, lineHeight) => {
    return { defaultFontSize, fontWeight, wordSpacing, letterSpacing, textIndent, lineHeight }
  }
)
