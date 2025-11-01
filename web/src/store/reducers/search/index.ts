import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const searchStore = 'searchStore'

export interface ISearchState {
  value: string
}

const defaultState: ISearchState = {
  value: '',
}

export const store = createSlice({
  name: searchStore,
  initialState: defaultState,
  reducers: {
    load(state) {
      return state
    },
    setValue(state, action: PayloadAction<string>) {
      state.value = action.payload
      return state
    },
  },
})

export const reducers = store.reducer
export const actions = store.actions
