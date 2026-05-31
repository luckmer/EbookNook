import { createSlice } from '@reduxjs/toolkit'
import type { PayloadType } from '@store/helper'

export const notesStore = 'notesStore'

export interface INotesState {
  note: any
}

export const defaultState: INotesState = {
  note: '',
}

export const store = createSlice({
  name: notesStore,
  initialState: defaultState,
  reducers: {
    load(state) {
      return state
    },
  },
})

export const reducers = store.reducer
export const actions = store.actions
export type PayloadTypes = PayloadType<typeof actions>
