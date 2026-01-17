import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const uiStore = 'uiStore'

export interface IOpenBookOverviewModal {
  status: boolean
  bookId: string
}

export interface IUiState {
  isFetchingStructure: boolean
  openChaptersDrawer: boolean
  openSettingsModal: boolean
  openBookOverviewModal: IOpenBookOverviewModal
  isLoadingState: boolean
  hideHeader: boolean
}

const defaultOpenBookOverviewModalState = { status: false, bookId: '' }

const defaultState: IUiState = {
  isFetchingStructure: true,
  openChaptersDrawer: false,
  openBookOverviewModal: defaultOpenBookOverviewModalState,
  openSettingsModal: false,
  isLoadingState: true,
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
  },
})

export const reducers = store.reducer
export const actions = store.actions
