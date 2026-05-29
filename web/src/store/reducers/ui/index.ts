import type { FormatType } from '@bindings/format'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export const uiStore = 'uiStore'

export interface IOpenBookOverviewModal {
  status: boolean
  bookId: string
  format: FormatType
}

export interface IUiState {
  isFetchingStructure: boolean
  openChaptersDrawer: boolean
  openSettingsModal: boolean
  openBookOverviewModal: IOpenBookOverviewModal
  isFetchingHighlightsStructure: boolean
  isFetchingNotesStructure: boolean
  openCreateBookmarkModal: boolean
  isAddingBook: boolean
  isLoadingState: boolean
  hideHeader: boolean
}

const defaultOpenBookOverviewModalState: IOpenBookOverviewModal = {
  status: false,
  format: 'EPUB',
  bookId: '',
}

const defaultState: IUiState = {
  openBookOverviewModal: defaultOpenBookOverviewModalState,
  isFetchingHighlightsStructure: true,
  isFetchingNotesStructure: true,
  isFetchingStructure: true,
  openChaptersDrawer: false,
  openCreateBookmarkModal: false,
  openSettingsModal: false,
  isLoadingState: true,
  isAddingBook: false,
  hideHeader: false,
}

export const store = createSlice({
  name: uiStore,
  initialState: defaultState,
  reducers: {
    load(state) {
      return state
    },
    setOpenChaptersDrawer(state, action: PayloadAction<boolean>) {
      state.openChaptersDrawer = action.payload
      return state
    },
    setOpenSettingsModal(state, action: PayloadAction<boolean>) {
      state.openSettingsModal = action.payload
      return state
    },
    setOpenBookOverviewModal(state, action: PayloadAction<IOpenBookOverviewModal>) {
      state.openBookOverviewModal = action.payload
      return state
    },
    setHideHeader(state, action: PayloadAction<boolean>) {
      state.hideHeader = action.payload
      return state
    },
    setIsLoadingState(state, action: PayloadAction<boolean>) {
      state.isLoadingState = action.payload
      return state
    },
    setIsFetchingStructure(state, action: PayloadAction<boolean>) {
      state.isFetchingStructure = action.payload
      return state
    },
    setOpenCreateBookmarkModal(state, action: PayloadAction<boolean>) {
      state.openCreateBookmarkModal = action.payload
      return state
    },
    setIsFetchingHighlightsStructure(state, action: PayloadAction<boolean>) {
      state.isFetchingHighlightsStructure = action.payload
      return state
    },
    setIsFetchingNotesStructure(state, action: PayloadAction<boolean>) {
      state.isFetchingNotesStructure = action.payload
      return state
    },

    setIsAddingBook(state, action: PayloadAction<boolean>) {
      state.isAddingBook = action.payload
      return state
    },
  },
})

export const reducers = store.reducer
export const actions = store.actions
