import type { IBindingsBook, IBindingsBookContent, IBindingsBookStructure } from '@bindings/book'
import type { FormatType } from '@bindings/format'
import type { IBindingsMetadata } from '@bindings/metadata'
import type { IBindingsProgress } from '@bindings/progress'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { PayloadType } from '@store/helper'

export const booksStore = 'booksStore'

export interface IToc {
  href: string
  label: string
}

export interface IBookState {
  selectedChapter: string
  books: Partial<Record<string, IBindingsBook>>
  activeToc: IToc
  files: Record<string, File | null>
}

export const defaultActiveToc: IToc = {
  label: '',
  href: '',
}

export const defaultState: IBookState = {
  selectedChapter: '',
  activeToc: defaultActiveToc,
  files: {},
  books: {},
}

export const store = createSlice({
  name: booksStore,
  initialState: defaultState,

  reducers: {
    load(state) {
      return state
    },

    setBook(state, action: PayloadAction<{ id: string; book: IBindingsBook }>) {
      const { id, book } = action.payload
      state.books[id] = book
    },

    setActiveBook(state, action: PayloadAction<{ id: string; book: File }>) {
      state.files[action.payload.id] = action.payload.book
      return state
    },

    setSelectedChapter(state, action: PayloadAction<string>) {
      state.selectedChapter = action.payload
      return state
    },
    setOpenBook(state, _: PayloadAction<{ id: string; format: FormatType }>) {
      return state
    },

    importBook(state, _: PayloadAction<File>) {
      return state
    },
    setActiveToc(state, action: PayloadAction<IToc>) {
      state.activeToc = action.payload
      return state
    },

    setBookStructure(state, action: PayloadAction<IBindingsBookStructure>) {
      const { id } = action.payload

      const book = state.books[id]
      if (!book) return state

      book.sections = action.payload.sections
      book.toc = action.payload.toc

      return state
    },

    setUpdateBookMetadata(
      state,
      action: PayloadAction<{
        id: string
        metadata: Partial<IBindingsMetadata>
      }>,
    ) {
      const book = state.books[action.payload.id]

      if (!book) {
        return state
      }

      book.metadata.author = action.payload.metadata.author ?? book.metadata.author
      book.metadata.description = action.payload.metadata.description ?? book.metadata.description
      book.metadata.published = action.payload.metadata.published ?? book.metadata.published
      book.metadata.publisher = action.payload.metadata.publisher ?? book.metadata.publisher
      book.metadata.title = action.payload.metadata.title ?? book.metadata.title

      return state
    },

    deleteBook(state, action: PayloadAction<{ id: string; format: FormatType }>) {
      const book = state.books[action.payload.id]

      if (!book) return state

      delete state.books[action.payload.id]

      return state
    },

    setFile(state, action: PayloadAction<{ id: string; file: File }>) {
      state.files[action.payload.id] = action.payload.file
      return state
    },
    setUpdateBookProgress(state, action: PayloadAction<IBindingsProgress>) {
      const book = state.books[action.payload.id]
      if (!book) return state

      book.progress = action.payload.progress
      book.percentageProgress = action.payload.percentageProgress

      return state
    },

    setBooks(state, action: PayloadAction<Record<string, IBindingsBook>>) {
      state.books = action.payload
      return state
    },

    setDeleteBook(state, _: PayloadAction<{ id: string; format: FormatType }>) {
      return state
    },
    updateBookMetadata(
      state,
      _: PayloadAction<{
        id: string
        format: FormatType
        metadata: Partial<Record<IBindingsBookContent, string>>
      }>,
    ) {
      return state
    },
    updateBookProgress(state, _: PayloadAction<IBindingsProgress>) {
      return state
    },
  },
})

export const reducers = store.reducer
export const actions = store.actions
export type PayloadTypes = PayloadType<typeof actions>
