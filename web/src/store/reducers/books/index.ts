import { Chapter, IBook, IToc } from '@interfaces/book/interfaces'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PayloadType } from '@store/helper'

export const booksStore = 'booksStore'

type Hash = string

export interface IBookState {
  books: IBook[]
  chapters: Record<Hash, Chapter[]>
  toc: Record<Hash, IToc[]>
}

const defaultState: IBookState = {
  books: [],
  toc: {},
  chapters: {},
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

    setBook(state, action: PayloadAction<IBook>) {
      state.books.push(action.payload)
      return state
    },
    setChapters(state, action: PayloadAction<{ hash: Hash; chapters: Chapter[] }>) {
      if (!state.chapters[action.payload.hash]) {
        state.chapters[action.payload.hash] = []
      }

      state.chapters[action.payload.hash] = action.payload.chapters
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
