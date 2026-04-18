import { IBookFile, ITocItem } from '@bindings/book'
import { BOOK_STATUS } from '@interfaces/book/enums'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PayloadType } from '@store/helper'

export const booksStore = 'booksStore'

export interface IBookState {
  selectedChapter: string
  statuses: Record<string, BOOK_STATUS>
  books: Record<string, IBookFile>
  activeToc: ITocItem
  files: Record<string, File | null>
}

export const defaultActiveToc = {
  id: 0,
  label: '',
  href: '',
  index: 0,
}

const defaultState: IBookState = {
  selectedChapter: '',
  activeToc: defaultActiveToc,
  files: {},
  statuses: {},
  books: {},
}

export const store = createSlice({
  name: booksStore,
  initialState: defaultState,

  reducers: {
    load(state) {
      return state
    },
    setStatus(state, action: PayloadAction<{ id: string; status: BOOK_STATUS }>) {
      state.statuses[action.payload.id] = action.payload.status
      return state
    },

    setBook(state, action: PayloadAction<{ id: string; book: IBookFile }>) {
      state.books[action.payload.id] = action.payload.book
      return state
    },

    setActiveBook(state, action: PayloadAction<{ id: string; book: File }>) {
      state.files[action.payload.id] = action.payload.book
      return state
    },

    setSelectedChapter(state, action: PayloadAction<string>) {
      state.selectedChapter = action.payload
      return state
    },
    setOpenBook(state, _: PayloadAction<string>) {
      return state
    },
    importBook(state, _: PayloadAction<File>) {
      return state
    },
    setActiveToc(state, action: PayloadAction<ITocItem>) {
      state.activeToc = action.payload
      return state
    },
    setFile(state, action: PayloadAction<{ id: string; file: File }>) {
      state.files[action.payload.id] = action.payload.file
      return state
    },
    setBooks(state, action: PayloadAction<Record<string, IBookFile>>) {
      state.books = action.payload
      return state
    },
  },
})

export const reducers = store.reducer
export const actions = store.actions
export type PayloadTypes = PayloadType<typeof actions>
