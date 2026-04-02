import { ISettingsState } from '@interfaces/settings/interfaces'
import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import { reducers as annotationsReducers, annotationsStore } from './annotations'
import { reducers as bookReducers, booksStore } from './books'
import { reducers as NotificationReducers, notificationStore } from './notifications'
import { reducers as searchReducers, searchStore } from './search'
import { reducers as settingsReducers, settingsStore } from './settings'
import { persistSettings } from './settings/config'
import { reducers as uiReducers, uiStore } from './ui'

const Index = combineReducers({
  [settingsStore]: persistReducer<ISettingsState>(persistSettings, settingsReducers),
  [notificationStore]: NotificationReducers,
  [annotationsStore]: annotationsReducers,
  [searchStore]: searchReducers,
  [booksStore]: bookReducers,
  [uiStore]: uiReducers,
})

export default Index
