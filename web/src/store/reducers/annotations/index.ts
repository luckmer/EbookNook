import { Highlight, Highlights } from '@bindings/highlights'
import { Note, Notes } from '@bindings/notes'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PayloadType } from '@store/helper'

export const annotationsStore = 'annotationsStore'

export interface ISelectedAnnotation {
  anchorId: string
  anchor: {
    normEnd: number
    normStart: number
    text: string
  }
}

export interface IAnnotationsState {
  highlights: Record<string, Highlights>
  notes: Record<string, Notes>
  editingNoteId: string | null
  selectedAnnotation: ISelectedAnnotation | null
}

const defaultState: IAnnotationsState = {
  editingNoteId: null,
  selectedAnnotation: null,
  highlights: {},
  notes: {},
}

export const store = createSlice({
  name: annotationsStore,
  initialState: defaultState,
  reducers: {
    setHighlights(state, action: PayloadAction<{ id: string; highlights: Highlights }>) {
      if (!state.highlights[action.payload.id]) {
        state.highlights[action.payload.id] = []
      }
      state.highlights[action.payload.id] = action.payload.highlights
      return state
    },
    setHighlight(state, action: PayloadAction<{ id: string; highlight: Highlight }>) {
      if (!state.highlights[action.payload.id]) {
        state.highlights[action.payload.id] = []
      }
      state.highlights[action.payload.id].push(action.payload.highlight)
      return state
    },
    setNotes(state, action: PayloadAction<{ id: string; notes: Notes }>) {
      if (!state.notes[action.payload.id]) {
        state.notes[action.payload.id] = []
      }
      state.notes[action.payload.id] = action.payload.notes
      return state
    },
    getAnnotationStructure(state, _: PayloadAction<string>) {
      return state
    },
    setSelectedAnnotation(state, action: PayloadAction<ISelectedAnnotation | null>) {
      state.selectedAnnotation = action.payload
      return state
    },

    setCustomNote(state, action: PayloadAction<{ id: string; note: Note }>) {
      if (!state.notes[action.payload.id]) {
        state.notes[action.payload.id] = []
      }
      state.notes[action.payload.id].push(action.payload.note)
      return state
    },
    setEditingNoteId(state, action: PayloadAction<string | null>) {
      state.editingNoteId = action.payload
      return state
    },
    saveNote(state, action: PayloadAction<{ id: string; note: Note }>) {
      const notes = state.notes[action.payload.id]

      const index = notes.findIndex((n) => n.id === action.payload.note.id)
      if (index !== -1) {
        notes[index] = action.payload.note
      }

      return state
    },

    deleteNoteById(state, action: PayloadAction<{ id: string; bookId: string }>) {
      const id = action.payload.id
      for (const key of Object.keys(state.notes)) {
        const index = state.notes[key].findIndex((a) => a.id === id)
        if (index !== -1) {
          state.notes[key].splice(index, 1)
          break
        }
      }
      return state
    },
    deleteHighlightById(state, action: PayloadAction<{ id: string; bookId: string }>) {
      const id = action.payload.id
      for (const key of Object.keys(state.highlights)) {
        const index = state.highlights[key].findIndex((a) => a.id === id)
        if (index !== -1) {
          state.highlights[key].splice(index, 1)
          break
        }
      }
      return state
    },
  },
})

export const reducers = store.reducer
export const actions = store.actions
export type PayloadTypes = PayloadType<typeof actions>
