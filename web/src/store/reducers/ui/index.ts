import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const uiStore = 'uiStore'

export interface IUiState {
  openChaptersDrawer: boolean
}

const defaultState: IUiState = {
  openChaptersDrawer: false,
}

export const store = createSlice({
  name: uiStore,
  initialState: defaultState,
  reducers: {
    load(state) {
      return state
    },
    setOpenChaptersDrawer(state, action: PayloadAction<boolean>) {
      state.openChaptersDrawer = action.payload
      return state
    },
  },
})

export const reducers = store.reducer
export const actions = store.actions
