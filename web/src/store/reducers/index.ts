import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import { reducers as bookReducers, booksStore } from './books'
import { reducers as languageReducers, languageStore } from './language'
import { persistLanguage } from './language/config'
import { reducers as searchReducers, searchStore } from './search'
import { reducers as settingsReducers, settingsStore } from './settings'
import { persistSettings } from './settings/config'
import { reducers as uiReducers, uiStore } from './ui'

const Index = combineReducers({
  [settingsStore]: persistReducer(persistSettings, settingsReducers),
  [languageStore]: persistReducer(persistLanguage, languageReducers),
  [searchStore]: searchReducers,
  [booksStore]: bookReducers,
  [uiStore]: uiReducers,
})

export default Index
