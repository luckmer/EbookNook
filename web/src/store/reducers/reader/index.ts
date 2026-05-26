import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PayloadType } from '@store/helper'

export const readerStore = 'readerStore'

export interface IReaderLocation {
  cfi: string
  fraction: number
  location: {
    current: number
    next: number
    total: number
  }
  time: {
    current: number
    total: number
  }
  tocItem: {
    href: string
    label: string
    id: number
    subitems: Array<{
      id: number
      href: string
      label: string
    }>
  }
}

export const defaultReaderLocation = {
  cfi: '',
  fraction: 0,
  location: {
    current: 0,
    next: 0,
    total: 0,
  },
  time: {
    current: 0,
    total: 0,
  },
  tocItem: {
    href: '',
    label: '',
    id: 0,
    subitems: [],
  },
}

export interface ISelectedBookmark {
  cfi: string | null
  selectedAt: string
}

export interface IBookState {
  readerLocation: IReaderLocation
  selectedBookmark: ISelectedBookmark
}

export const defaultSelectedBookmark = {
  cfi: null,
  selectedAt: Date.now().toString(),
}

export const defaultState: IBookState = {
  readerLocation: defaultReaderLocation,
  selectedBookmark: defaultSelectedBookmark,
}

export const store = createSlice({
  name: readerStore,
  initialState: defaultState,
  reducers: {
    load(state) {
      return state
    },
    setReaderLocation(state, action: PayloadAction<IReaderLocation>) {
      state.readerLocation = action.payload
    },
    setSelectedBookmark(state, action: PayloadAction<ISelectedBookmark>) {
      state.selectedBookmark = action.payload
    },
  },
})

export const reducers = store.reducer
export const actions = store.actions
export type PayloadTypes = PayloadType<typeof actions>
