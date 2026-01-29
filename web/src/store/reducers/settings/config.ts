import storage from 'redux-persist/lib/storage'

export const persistSettings = {
  key: 'settings',
  storage,
  whitelist: [
    'paragraphMargin',
    'defaultFontSize',
    'lineHeight',
    'wordSpacing',
    'letterSpacing',
    'textIndent',
    'fontWeight',
  ],
}
