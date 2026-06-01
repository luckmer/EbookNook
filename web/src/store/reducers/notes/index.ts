import type { IBindingsNote } from '@bindings/notes'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { PayloadType } from '@store/helper'

export const notesStore = 'notesStore'

export type pageNumber = string
export type bookId = string

export interface ISelectedNote {
  cfi: string | null
  selectedAt: string
}

export interface INotesState {
  notes: Partial<Record<bookId, Record<pageNumber, Array<IBindingsNote>>>>
  selectedNote: ISelectedNote
  pendingNote: IBindingsNote
}

export const defaultNote: IBindingsNote = {
  bookId: '',
  chapter: '',
  title: '',
  note: '',
  color: '',
  noteId: '',
  createdAt: '',
  updatedAt: '',
  value: '',
  page: '',
  text: '',
}

export const defaultSelectedNote = {
  cfi: null,
  selectedAt: Date.now().toString(),
}

export const defaultState: INotesState = {
  pendingNote: defaultNote,
  selectedNote: defaultSelectedNote,
  notes: {},
}

export const store = createSlice({
  name: notesStore,
  initialState: defaultState,
  reducers: {
    load(state) {
      return state
    },
    reset(state) {
      state.selectedNote = defaultSelectedNote
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
    deleteNote(state, _: PayloadAction<{ id: string; noteId: string; page: string }>) {
      return state
    },
    updateNote(state, _: PayloadAction<IBindingsNote>) {
      return state
    },

    setDeleteNote(state, action: PayloadAction<{ id: string; noteId: string; page: string }>) {
      const noteShelf = state.notes[action.payload.id]

      if (!noteShelf) {
        return state
      }

      noteShelf[action.payload.page] = noteShelf[action.payload.page].filter(
        (note) => note.noteId !== action.payload.noteId,
      )

      return state
    },

    setUpdateNote(state, action: PayloadAction<IBindingsNote>) {
      const { bookId, page, noteId } = action.payload
      const pageNotes = state.notes[bookId]?.[page]

      if (!pageNotes) return state

      const idx = pageNotes.findIndex((n) => n.noteId === noteId)
      if (idx !== -1) pageNotes[idx] = action.payload

      return state
    },

    setSelectedNote(state, action: PayloadAction<ISelectedNote>) {
      state.selectedNote = action.payload
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
