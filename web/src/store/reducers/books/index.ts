import { IBook, IToc } from '@interfaces/book/interfaces'
import { IProgress } from '@interfaces/book/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PayloadType } from '@store/helper'

export const booksStore = 'booksStore'

type Hash = string

export interface IBookState {
  books: IBook[]
  epubCodeSearch: string
  toc: Record<Hash, IToc[]>
  selectedChapter: string
}

const defaultState: IBookState = {
  books: [],
  toc: {},
  epubCodeSearch: '',
  selectedChapter: '',
}

export const store = createSlice({
  name: booksStore,
  initialState: defaultState,
  reducers: {
    load(state) {
      return state
    },

    importBook(state, _: PayloadAction<File>) {
      return state
    },

    loadBook(state, _: PayloadAction<string>) {
      return state
    },

    setSelectedChapter(state, action: PayloadAction<string>) {
      state.selectedChapter = action.payload
      return state
    },

    setBook(state, action: PayloadAction<IBook>) {
      state.books.push(action.payload)
      return state
    },

    setBookProgress(state, action: PayloadAction<{ hash: Hash; progress: IProgress }>) {
      const book = state.books.find((b) => b.hash === action.payload.hash)
      if (book) {
        book.progress = action.payload.progress
      }
      return state
    },

    setEpubCodeSearch(state, action: PayloadAction<string>) {
      state.epubCodeSearch = action.payload
      return state
    },

    setToc: (state, action: PayloadAction<{ hash: Hash; toc: IToc[] }>) => {
      if (!state.toc[action.payload.hash]) {
        state.toc[action.payload.hash] = []
      }
      state.toc[action.payload.hash] = action.payload.toc
      return state
    },
  },
})

export const reducers = store.reducer
export const actions = store.actions
export type PayloadTypes = PayloadType<typeof actions>
