import { FormatType } from '@bindings/format'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PayloadType } from '@store/helper'

export const bookmarksStore = 'bookmarksStore'

export interface IBookmarksState {}

const defaultState: IBookmarksState = {}

export const store = createSlice({
  name: bookmarksStore,
  initialState: defaultState,
  reducers: {
    load(state) {
      return state
    },
    saveBookmark(
      state,
      _: PayloadAction<{
        id: string
        format: FormatType
        date: string
        cfi: string
        label: string
      }>,
    ) {
      return state
    },
    deleteBookmark(state) {
      return state
    },
    updateBookmark(state) {
      return state
    },
  },
})

export const reducers = store.reducer
export const actions = store.actions
export type PayloadTypes = PayloadType<typeof actions>
