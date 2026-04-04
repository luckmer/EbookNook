import storage from 'redux-persist/lib/storage'

export const persistLanguage = {
  key: 'language',
  storage,
  whitelist: ['language'],
}
