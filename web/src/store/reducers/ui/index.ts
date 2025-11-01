import { createSlice } from '@reduxjs/toolkit'

export const uiStore = 'uiStore'

export interface IUiState {}

const defaultState: IUiState = {}

export const store = createSlice({
  name: uiStore,
  initialState: defaultState,
  reducers: {
    load(state) {
      return state
    },
    // setValue(state, action: PayloadAction<number>) {
    //   state.increase = ++action.payload
    //   return state
    // },
  },
})

export const reducers = store.reducer
export const actions = store.actions
