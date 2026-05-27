import { IBindingsBookmark } from '@bindings/bookmarks'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PayloadType } from '@store/helper'

export const bookmarksStore = 'bookmarksStore'

export interface ISelectedBookmark {
  cfi: string | null
  selectedAt: string
}

export interface IBookmarksState {
  selectedBookmark: ISelectedBookmark
  bookmarks: Record<string, IBindingsBookmark[]>
}

export const defaultSelectedBookmark = {
  cfi: null,
  selectedAt: Date.now().toString(),
}

const defaultState: IBookmarksState = {
  selectedBookmark: defaultSelectedBookmark,
  bookmarks: {},
}

export const store = createSlice({
  name: bookmarksStore,
  initialState: defaultState,
  reducers: {
    load(state) {
      return state
    },
    reset(state) {
      state.selectedBookmark = defaultState.selectedBookmark
    },
    saveBookmark(state, _: PayloadAction<IBindingsBookmark>) {
      return state
    },
    setBookmarks(state, action: PayloadAction<{ id: string; bookmarks: IBindingsBookmark[] }>) {
      state.bookmarks[action.payload.id] = action.payload.bookmarks
    },

    deleteBookmark(state, _: PayloadAction<{ id: string; cfi: string }>) {
      return state
    },

    updateBookmark(state, _: PayloadAction<IBindingsBookmark>) {
      return state
    },
    setAddBookmark(state, action: PayloadAction<IBindingsBookmark>) {
      if (!state.bookmarks[action.payload.bookId]) {
        state.bookmarks[action.payload.bookId] = []
      }

      state.bookmarks[action.payload.bookId].push(action.payload)

      return state
    },
    setUpdateBookmark(state, action: PayloadAction<IBindingsBookmark>) {
      const bookmarks = state.bookmarks[action.payload.bookId]

      if (!bookmarks) {
        return state
      }

      const index = bookmarks.findIndex((b) => b.cfi === action.payload.cfi)

      if (index === -1) return state

      bookmarks[index] = action.payload

      return state
    },
    setDeleteBookmark(state, action: PayloadAction<{ id: string; cfi: string }>) {
      const { id, cfi } = action.payload

      if (!state.bookmarks[id]) return state

      const index = state.bookmarks[id].findIndex((b) => b.cfi === cfi)

      if (index === -1) return state

      delete state.bookmarks[id][index]

      return state
    },
    setSelectedBookmark(state, action: PayloadAction<ISelectedBookmark>) {
      state.selectedBookmark = action.payload
    },
  },
})

export const reducers = store.reducer
export const actions = store.actions
export type PayloadTypes = PayloadType<typeof actions>
