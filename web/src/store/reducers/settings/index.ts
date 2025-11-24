import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const settingsStore = 'settingsStore'

export interface ISettingsState {
  defaultFontSize: number
  fontWeight: number
}

const defaultState: ISettingsState = {
  defaultFontSize: 16,
  fontWeight: 400,
}

export const store = createSlice({
  name: settingsStore,
  initialState: defaultState,
  reducers: {
    load(state) {
      return state
    },

    setDefaultFontSize(state, action: PayloadAction<number>) {
      state.defaultFontSize = action.payload
      return state
    },

    setFontWeight(state, action: PayloadAction<number>) {
      state.fontWeight = action.payload
      return state
    },
  },
})

export const reducers = store.reducer
export const actions = store.actions
