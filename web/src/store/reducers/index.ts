import { combineReducers } from '@reduxjs/toolkit'
import { reducers, uiStore } from './ui'

const Index = combineReducers({
  [uiStore]: reducers,
})

export default Index
