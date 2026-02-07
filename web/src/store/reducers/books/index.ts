import { Books } from '@bindings/book'
import { Epub, EpubStructure, Progress } from '@bindings/epub'
import { BookFormat } from '@interfaces/book/enums'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PayloadType } from '@store/helper'

export const booksStore = 'booksStore'

export interface IBookState {
  books: Books
  selectedChapter: string
}

const defaultState: IBookState = {
  selectedChapter: '',
  books: {
    epub: [],
  },
}

export const store = createSlice({
  name: booksStore,
  initialState: defaultState,
  reducers: {
    load(state) {
      return state
    },

    setBooks(state, action: PayloadAction<Books>) {
      state.books = action.payload
      return state
    },

    importBook(state, _: PayloadAction<File>) {
      return state
    },

    setSelectedChapter(state, action: PayloadAction<string>) {
      state.selectedChapter = action.payload
      return state
    },

    getEpubStructure(state, _: PayloadAction<string>) {
      return state
    },

    setUpdateEpubBookProgress(state, action: PayloadAction<{ progress: Progress; id: string }>) {
      const epubState = state.books[BookFormat.EPUB]

      epubState.forEach((epub) => {
        if (epub.book.id === action.payload.id) {
          epub.book.progress = action.payload.progress
        }
      })
    },

    setEpubBook(state, action: PayloadAction<Epub>) {
      state.books[BookFormat.EPUB].push(action.payload)
      return state
    },

    setEpubStructure(state, action: PayloadAction<{ structure: EpubStructure; id: string }>) {
      const epubState = state.books[BookFormat.EPUB]

      epubState.forEach((epub) => {
        if (epub.book.id === action.payload.id) {
          epub.chapters = action.payload.structure.chapters
          epub.toc = action.payload.structure.toc
        }
      })

      return state
    },

    deleteEpub(state, _: PayloadAction<string>) {
      return state
    },

    removeEpub(state, action: PayloadAction<string>) {
      state.books.epub = state.books.epub.filter((epub) => epub.book.id !== action.payload)
      return state
    },

    editEpub(state) {
      return state
    },
  },
})

export const reducers = store.reducer
export const actions = store.actions
export type PayloadTypes = PayloadType<typeof actions>
