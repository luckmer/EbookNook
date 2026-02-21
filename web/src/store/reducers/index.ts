import { combineReducers } from '@reduxjs/toolkit'
import { reducers as bookReducers, booksStore } from './books'
import { reducers as searchReducers, searchStore } from './search'
import { reducers as settingsReducers, settingsStore } from './settings'
import { reducers as uiReducers, uiStore } from './ui'
import { reducers as annotationsReducers, annotationsStore } from './annotations'
import { persistReducer } from 'redux-persist'
import { persistSettings } from './settings/config'
import { ISettingsState } from '@interfaces/settings/interfaces'

const Index = combineReducers({
  [settingsStore]: persistReducer<ISettingsState>(persistSettings, settingsReducers),
  [annotationsStore]: annotationsReducers,
  [searchStore]: searchReducers,
  [booksStore]: bookReducers,
  [uiStore]: uiReducers,
})

export default Index
