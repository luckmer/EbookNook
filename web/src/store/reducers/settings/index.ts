import { ISettingsState } from '@interfaces/settings/interfaces'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const settingsStore = 'settingsStore'

const defaultState: ISettingsState = {
  defaultFontSize: 16,
  fontWeight: 400,
  wordSpacing: 0,
  letterSpacing: 0,
  textIndent: 0,
  lineHeight: 1.5,
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

    setWordSpacing(state, action: PayloadAction<number>) {
      state.wordSpacing = action.payload
      return state
    },

    setLetterSpacing(state, action: PayloadAction<number>) {
      state.letterSpacing = action.payload
      return state
    },

    setTextIndent(state, action: PayloadAction<number>) {
      state.textIndent = action.payload
      return state
    },

    setLineHeight(state, action: PayloadAction<number>) {
      state.lineHeight = action.payload
      return state
    },
    setResetFontSettings(state) {
      state.defaultFontSize = defaultState.defaultFontSize
      state.fontWeight = defaultState.fontWeight
      return state
    },
    setResetLayoutSettings(state) {
      state.wordSpacing = defaultState.wordSpacing
      state.letterSpacing = defaultState.letterSpacing
      state.textIndent = defaultState.textIndent
      state.lineHeight = defaultState.lineHeight
      return state
    },
  },
})

export const reducers = store.reducer
export const actions = store.actions
