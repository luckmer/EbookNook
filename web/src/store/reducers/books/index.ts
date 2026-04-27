import { IBookMetadata, IBookStructure, IBookType } from '@bindings/book'
import { FormatType } from '@bindings/format'
import { BOOK_STATUS } from '@interfaces/book/enums'
import { ILocalBookToc } from '@interfaces/book/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PayloadType } from '@store/helper'

export const booksStore = 'booksStore'

export interface IBookState {
  selectedChapter: string
  statuses: Record<string, BOOK_STATUS>
  books: Partial<Record<FormatType, Partial<Record<string, IBookType>>>>
  activeToc: ILocalBookToc
  files: Record<string, File | null>
}

export const defaultActiveToc = {
  id: -1,
  label: '',
  href: '',
  index: -1,
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

    setBook(state, action: PayloadAction<{ id: string; book: IBookType }>) {
      const { id, book } = action.payload
      const format = book.format

      if (!state.books[format]) {
        state.books[format] = {}
      }

      state.books[format][id] = book
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

    getBookStructure(state, _: PayloadAction<{ id: string; format: FormatType }>) {
      return state
    },
    importBook(state, _: PayloadAction<File>) {
      return state
    },
    setActiveToc(state, action: PayloadAction<ILocalBookToc>) {
      state.activeToc = action.payload
      return state
    },

    setBookStructure(state, action: PayloadAction<{ id: string; structure: IBookStructure }>) {
      let bookShelf = state.books[action.payload.structure.format]

      if (!bookShelf) {
        bookShelf = {}
      }

      let book = bookShelf[action.payload.id]

      if (!book) {
        return state
      }

      book.sections = action.payload.structure.sections
      book.toc = action.payload.structure.toc

      return state
    },

    setUpdateBookMetadata(
      state,
      action: PayloadAction<{ id: string; format: FormatType; metadata: IBookMetadata }>,
    ) {
      const bookShelf = state.books[action.payload.format]

      if (!bookShelf) {
        return state
      }

      const book = bookShelf[action.payload.id]

      if (!book) {
        return state
      }

      book.metadata.author = action.payload.metadata.metadata.author ?? book.metadata.author
      book.metadata.description =
        action.payload.metadata.metadata.description ?? book.metadata.description
      book.metadata.published =
        action.payload.metadata.metadata.published ?? book.metadata.published
      book.metadata.publisher =
        action.payload.metadata.metadata.publisher ?? book.metadata.publisher
      book.metadata.title = action.payload.metadata.metadata.title ?? book.metadata.title

      return state
    },

    deleteBook(state, action: PayloadAction<{ id: string; format: FormatType }>) {
      let bookShelf = state.books[action.payload.format]
      if (!bookShelf) {
        return state
      }

      delete bookShelf[action.payload.id]

      return state
    },

    setFile(state, action: PayloadAction<{ id: string; file: File }>) {
      state.files[action.payload.id] = action.payload.file
      return state
    },
    setBooks(
      state,
      action: PayloadAction<Partial<Record<FormatType, Partial<Record<string, IBookType>>>>>,
    ) {
      state.books = action.payload
      return state
    },
    setDeleteBook(state, _: PayloadAction<{ id: string; format: FormatType }>) {
      return state
    },
    updateBookMetadata(
      state,
      _: PayloadAction<{ id: string; format: FormatType; metadata: IBookMetadata }>,
    ) {
      return state
    },
  },
})

export const reducers = store.reducer
export const actions = store.actions
export type PayloadTypes = PayloadType<typeof actions>
