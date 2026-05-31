import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import { reducers as bookmarksReducers, bookmarksStore } from './bookmarks'
import { persistBookmarks } from './bookmarks/config'
import { reducers as booksReducers, booksStore } from './books'
import { reducers as languageReducers, languageStore } from './language'
import { persistLanguage } from './language/config'
import { reducers as notesReducers, notesStore } from './notes'
import { reducers as bookReducers, readerStore } from './reader'
import { reducers as searchReducers, searchStore } from './search'
import { reducers as settingsReducers, settingsStore } from './settings'
import { persistSettings } from './settings/config'
import { reducers as uiReducers, uiStore } from './ui'

const Index = combineReducers({
  [settingsStore]: persistReducer(persistSettings, settingsReducers),
  [languageStore]: persistReducer(persistLanguage, languageReducers),
  [bookmarksStore]: persistReducer(persistBookmarks, bookmarksReducers),
  [notesStore]: notesReducers,
  [searchStore]: searchReducers,
  [booksStore]: booksReducers,
  [readerStore]: bookReducers,
  [uiStore]: uiReducers,
})

export default Index
