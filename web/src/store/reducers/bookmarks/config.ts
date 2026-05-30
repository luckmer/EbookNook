import storage from 'redux-persist/lib/storage'

export const persistBookmarks = {
  key: 'bookmarks',
  storage,
  whitelist: ['selectedBookmark'],
}
