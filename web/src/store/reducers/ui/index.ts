import type { FormatType } from '@bindings/format'
import type { LOADER_STATE } from '@interfaces/ui/enums'
import type { LoaderState } from '@interfaces/ui/types'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export const uiStore = 'uiStore'

export interface IOpenBookOverviewModal {
  status: boolean
  bookId: string
  format: FormatType
}

export interface IUiState {
  loaderState: Partial<Record<LOADER_STATE, LoaderState>>
  scopedLoaderState: Partial<Record<string, Partial<Record<LOADER_STATE, LoaderState>>>>
  openChaptersDrawer: boolean
  openSettingsModal: boolean
  openBookOverviewModal: IOpenBookOverviewModal
  openCreateBookmarkModal: boolean
  openCreateNoteModal: boolean
  hideHeader: boolean
}

const defaultOpenBookOverviewModalState: IOpenBookOverviewModal = {
  status: false,
  format: 'EPUB',
  bookId: '',
}

export const defaultState: IUiState = {
  openBookOverviewModal: defaultOpenBookOverviewModalState,
  loaderState: {},
  scopedLoaderState: {},
  openChaptersDrawer: false,
  openCreateNoteModal: false,
  openCreateBookmarkModal: false,
  openSettingsModal: false,
  hideHeader: false,
}

export const store = createSlice({
  name: uiStore,
  initialState: defaultState,
  reducers: {
    load(state) {
      return state
    },
    setLoaderState(state, action: PayloadAction<{ loader: LOADER_STATE; state: LoaderState }>) {
      state.loaderState[action.payload.loader] = action.payload.state
      return state
    },
    setScopedLoaderState(
      state,
      action: PayloadAction<{ scope: string; loader: LOADER_STATE; state: LoaderState }>,
    ) {
      const { scope, loader, state: loaderState } = action.payload

      if (!state.scopedLoaderState[scope]) {
        state.scopedLoaderState[scope] = {}
      }

      state.scopedLoaderState[scope][loader] = loaderState

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
    setOpenCreateNoteModal(state, action: PayloadAction<boolean>) {
      state.openCreateNoteModal = action.payload
      return state
    },
    setHideHeader(state, action: PayloadAction<boolean>) {
      state.hideHeader = action.payload
      return state
    },
    setOpenCreateBookmarkModal(state, action: PayloadAction<boolean>) {
      state.openCreateBookmarkModal = action.payload
      return state
    },
  },
})

export const reducers = store.reducer
export const actions = store.actions
