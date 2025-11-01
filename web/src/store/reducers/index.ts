import { combineReducers } from '@reduxjs/toolkit'
import { reducers, uiStore } from './ui'
import { searchStore } from './search'

const Index = combineReducers({
  [searchStore]: reducers,
  [uiStore]: reducers,
})

export default Index
