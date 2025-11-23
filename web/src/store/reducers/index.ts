import { combineReducers } from '@reduxjs/toolkit'
import { reducers as bookReducers, booksStore } from './books'
import { reducers as searchReducers, searchStore } from './search'
import { reducers as settingsReducers, settingsStore } from './settings'
import { reducers as uiReducers, uiStore } from './ui'

const Index = combineReducers({
  [settingsStore]: settingsReducers,
  [searchStore]: searchReducers,
  [booksStore]: bookReducers,
  [uiStore]: uiReducers,
})

export default Index
