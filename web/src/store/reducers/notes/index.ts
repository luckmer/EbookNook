import type { IBindingsNote } from '@bindings/notes'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { PayloadType } from '@store/helper'

export const notesStore = 'notesStore'

export type pageNumber = string
export type bookId = string

export interface INotesState {
  notes: Partial<Record<bookId, Record<pageNumber, Array<IBindingsNote>>>>
  pendingNote: IBindingsNote
}

export const defaultNote: IBindingsNote = {
  bookId: '',
  chapter: '',
  title: '',
  note: '',
  noteId: '',
  createdAt: '',
  updatedAt: '',
  value: '',
  page: '',
  text: '',
}

export const defaultState: INotesState = {
  pendingNote: defaultNote,
  notes: {},
}

export const store = createSlice({
  name: notesStore,
  initialState: defaultState,
  reducers: {
    load(state) {
      return state
    },
    setPendingNote(state, action: PayloadAction<IBindingsNote>) {
      state.pendingNote = action.payload
      return state
    },
    setNotes(
      state,
      action: PayloadAction<Partial<Record<bookId, Record<pageNumber, Array<IBindingsNote>>>>>,
    ) {
      state.notes = action.payload
      return state
    },
    addNote(state, _: PayloadAction<IBindingsNote>) {
      return state
    },
    setAddNote(state, action: PayloadAction<IBindingsNote>) {
      const notesShelf = state.notes[action.payload.bookId]

      if (!notesShelf) {
        state.notes[action.payload.bookId] = {
          [action.payload.page]: [action.payload],
        }
      } else {
        if (!notesShelf[action.payload.page]) {
          notesShelf[action.payload.page] = [action.payload]
        } else {
          notesShelf[action.payload.page].push(action.payload)
        }
      }

      return state
    },
  },
})

export const reducers = store.reducer
export const actions = store.actions
export type PayloadTypes = PayloadType<typeof actions>
