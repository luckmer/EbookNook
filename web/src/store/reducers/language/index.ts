import { LANGUAGE } from '@interfaces/language/enums'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const languageStore = 'languageStore'

export interface ILanguageState {
  language: LANGUAGE
}

export const defaultState: ILanguageState = {
  language: LANGUAGE.ENGLISH,
}

export const store = createSlice({
  name: languageStore,
  initialState: defaultState,
  reducers: {
    setLanguage: (state, action: PayloadAction<LANGUAGE>) => {
      state.language = action.payload
    },
  },
})

export const reducers = store.reducer
export const actions = store.actions
