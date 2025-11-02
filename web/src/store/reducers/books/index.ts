import { IBook } from '@interfaces/book/interfaces'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PayloadType } from '@store/helper'

export const booksStore = 'booksStore'

export interface IBookState {
  books: IBook[]
}

const defaultState: IBookState = {
  books: [],
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

    setBook(state, action: PayloadAction<IBook>) {
      state.books.push(action.payload)
      return state
    },
  },
})

export const reducers = store.reducer
export const actions = store.actions
export type PayloadTypes = PayloadType<typeof actions>
