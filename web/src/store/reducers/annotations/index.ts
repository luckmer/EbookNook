import { Highlight, Highlights } from '@bindings/highlights'
import { Note, Notes } from '@bindings/notes'
import { ANNOTATIONS_STATUS } from '@interfaces/annotations/enums'
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

export interface IHighlight extends Highlight {
  isPending?: boolean
}

export interface IAnnotationsState {
  highlights: Record<string, IHighlight[]>
  notes: Record<string, Notes>
  selectedAnnotation: ISelectedAnnotation | null
  statuses: Record<string, ANNOTATIONS_STATUS>
}

const defaultState: IAnnotationsState = {
  selectedAnnotation: null,
  highlights: {},
  statuses: {},
  notes: {},
}

export const store = createSlice({
  name: annotationsStore,
  initialState: defaultState,
  reducers: {
    setStatus(state, action: PayloadAction<{ id: string; status: ANNOTATIONS_STATUS }>) {
      state.statuses[action.payload.id] = action.payload.status
      return state
    },
    setNotes(state, action: PayloadAction<{ id: string; notes: Notes }>) {
      if (!state.notes[action.payload.id]) {
        state.notes[action.payload.id] = []
      }
      state.notes[action.payload.id] = action.payload.notes
      return state
    },
    setHighlights(state, action: PayloadAction<{ id: string; highlights: Highlights }>) {
      if (!state.highlights[action.payload.id]) {
        state.highlights[action.payload.id] = []
      }
      state.highlights[action.payload.id] = action.payload.highlights
      return state
    },

    deleteNotesByIds(state, action: PayloadAction<{ ids: string[]; bookId: string }>) {
      const idSet = new Set(action.payload.ids)

      for (const key of Object.keys(state.notes)) {
        state.notes[key] = state.notes[key].filter((a) => !idSet.has(a.id))
      }

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

    removeHighlightById(state, action: PayloadAction<{ id: string; bookId: string }>) {
      const highlight = state.highlights[action.payload.bookId]

      if (highlight) {
        const index = highlight.findIndex((a) => a.id === action.payload.id)
        if (index !== -1) {
          highlight.splice(index, 1)
        }
      }
      return state
    },
    removeHighlightPendingStatus(
      state,
      action: PayloadAction<{ id: string; highlightId: string }>,
    ) {
      const highlight = state.highlights[action.payload.id]

      if (highlight) {
        const index = highlight.findIndex((a) => a.id === action.payload.highlightId)
        if (index !== -1) {
          highlight[index].isPending = false
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

    setSaveNote(state, _: PayloadAction<{ id: string; note: Note }>) {
      return state
    },

    setDeleteNoteById(state, _: PayloadAction<{ id: string; bookId: string }>) {
      return state
    },

    setDeleteHighlightById(state, _: PayloadAction<{ id: string; bookId: string }>) {
      return state
    },
    setHighlight(state, action: PayloadAction<{ id: string; highlight: IHighlight }>) {
      if (!state.highlights[action.payload.id]) {
        state.highlights[action.payload.id] = []
      }
      state.highlights[action.payload.id].push(action.payload.highlight)
      return state
    },
  },
})

export const reducers = store.reducer
export const actions = store.actions
export type PayloadTypes = PayloadType<typeof actions>
