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
  settingsSelector.paragraphMargin,
  (
    defaultFontSize,
    fontWeight,
    wordSpacing,
    letterSpacing,
    textIndent,
    lineHeight,
    paragraphMargin,
  ) => ({
    defaultFontSize,
    fontWeight,
    wordSpacing,
    letterSpacing,
    textIndent,
    lineHeight,
    paragraphMargin,
  }),
)

const fontStyles = createSelector(
  settingsSelector.defaultFontSize,
  settingsSelector.fontWeight,
  (fontSize, fontWeight) => {
    const localFontUrl = `${window.location.origin}/fonts/Raleway-VariableFont_wght.ttf`

    return `
      @font-face {
        font-family: 'Raleway';
        src: url("${localFontUrl}") format("truetype");
        font-weight: 100 900;
        font-style: normal;
      }

      html, body, div, span, p, li, td, th, h1, h2, h3, h4, h5, h6 {
        font-family: 'Raleway', sans-serif !important;
        font-size: ${fontSize}px !important;
        font-weight: ${fontWeight} !important;
      }

      b, strong, h1, h2, h3 {
        font-weight: ${Math.min(parseInt(fontWeight.toString()), 900)} !important;
      }
    `
  },
)

const layoutStyles = createSelector(
  settingsSelector.wordSpacing,
  settingsSelector.letterSpacing,
  settingsSelector.textIndent,
  settingsSelector.lineHeight,
  settingsSelector.paragraphMargin,
  (wordSpacing, letterSpacing, textIndent, lineHeight, paragraphMargin) => `
    * {
      background-color: transparent !important;
      color: white !important;
      word-spacing: ${wordSpacing}em !important;
      letter-spacing: ${letterSpacing}em !important;
      line-height: ${lineHeight} !important;
    }

    p {
      text-indent: ${textIndent}ch !important;
      margin-bottom: ${paragraphMargin}em !important;
      margin-top: 0 !important;
    }
  `,
)

export const settingsStyles = createSelector(
  fontStyles,
  layoutStyles,
  (font, layout) => `${font}\n${layout}`,
)
