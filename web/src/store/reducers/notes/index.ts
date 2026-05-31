import type { IBindingsNote } from '@bindings/notes'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { PayloadType } from '@store/helper'

export const notesStore = 'notesStore'

export type pageNumber = string
export type bookId = string

export interface INotesState {
  notes: Partial<Record<bookId, Record<pageNumber, Array<IBindingsNote>>>>
}

export const defaultState: INotesState = {
  notes: {},
}

export const store = createSlice({
  name: notesStore,
  initialState: defaultState,
  reducers: {
    load(state) {
      return state
    },
    setNotes(
      state,
      action: PayloadAction<Partial<Record<bookId, Record<pageNumber, Array<IBindingsNote>>>>>,
    ) {
      state.notes = action.payload

      return state
    },
  },
})

export const reducers = store.reducer
export const actions = store.actions
export type PayloadTypes = PayloadType<typeof actions>
