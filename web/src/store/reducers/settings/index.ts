import { createSlice } from '@reduxjs/toolkit'

export const settingsStore = 'settingsStore'

export interface ISettingsState {}

const defaultState: ISettingsState = {}

export const store = createSlice({
  name: settingsStore,
  initialState: defaultState,
  reducers: {
    load(state) {
      return state
    },
  },
})

export const reducers = store.reducer
export const actions = store.actions
