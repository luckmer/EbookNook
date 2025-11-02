import { combineReducers } from '@reduxjs/toolkit'
import { reducers as uiReducers, uiStore } from './ui'
import { searchStore, reducers as searchReducers } from './search'
import { booksStore, reducers as bookReducers } from './books'

const Index = combineReducers({
  [searchStore]: searchReducers,
  [booksStore]: bookReducers,
  [uiStore]: uiReducers,
})

export default Index
