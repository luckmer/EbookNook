import { LOADER_STATE, LOADER_STATUS } from '@interfaces/ui/enums'
import type { LoaderState } from '@interfaces/ui/types'
import { describe, expect, test } from 'vitest'
import { actions, defaultState, type IOpenBookOverviewModal, reducers } from './index'

describe('uiStore', () => {
  describe('load', () => {
    test('Load initial state', () => {
      expect(reducers(undefined, actions.load())).toEqual(defaultState)
    })
  })

  describe('setLoaderState', () => {
    test('Should set loader state', () => {
      const loaderStateContent: { loader: LOADER_STATE; state: LoaderState } = {
        loader: LOADER_STATE.IS_ADDING_BOOK,
        state: {
          status: LOADER_STATUS.IDLE,
        },
      }

      const content = {
        ...defaultState,
        loaderState: {
          [loaderStateContent.loader]: loaderStateContent.state,
        },
      }

      expect(reducers(defaultState, actions.setLoaderState(loaderStateContent))).toStrictEqual(
        content,
      )
    })

    test('should set multiple loader states', () => {
      const isAddingBook: { loader: LOADER_STATE; state: LoaderState } = {
        loader: LOADER_STATE.IS_ADDING_BOOK,
        state: {
          status: LOADER_STATUS.IDLE,
        },
      }

      const isAddingNote: { loader: LOADER_STATE; state: LoaderState } = {
        loader: LOADER_STATE.IS_ADDING_NOTE,
        state: {
          status: LOADER_STATUS.LOADING,
        },
      }

      const stateAfterFirst = reducers(defaultState, actions.setLoaderState(isAddingBook))
      const stateAfterSecond = reducers(stateAfterFirst, actions.setLoaderState(isAddingNote))

      expect(stateAfterSecond).toStrictEqual({
        ...defaultState,
        loaderState: {
          [isAddingBook.loader]: isAddingBook.state,
          [isAddingNote.loader]: isAddingNote.state,
        },
      })
    })

    test('should dynamically update loader state', () => {
      const addingBookIdle: { loader: LOADER_STATE; state: LoaderState } = {
        loader: LOADER_STATE.IS_ADDING_NOTE,
        state: {
          status: LOADER_STATUS.IDLE,
        },
      }

      const content = {
        ...defaultState,
        loaderState: {
          [addingBookIdle.loader]: addingBookIdle.state,
        },
      }

      expect(reducers(defaultState, actions.setLoaderState(addingBookIdle))).toStrictEqual(content)

      const addingBookLoader: { loader: LOADER_STATE; state: LoaderState } = {
        loader: LOADER_STATE.IS_ADDING_NOTE,
        state: {
          status: LOADER_STATUS.LOADING,
        },
      }

      const contentAfter = {
        ...defaultState,
        loaderState: {
          [addingBookLoader.loader]: addingBookLoader.state,
        },
      }

      expect(reducers(defaultState, actions.setLoaderState(addingBookLoader))).toStrictEqual(
        contentAfter,
      )
    })
  })

  describe('setScopedLoaderState', () => {
    test('should not change state when dispatching the same scoped loader state', () => {
      const addingBookIdle: { scope: string; loader: LOADER_STATE; state: LoaderState } = {
        scope: 'ID',
        loader: LOADER_STATE.IS_ADDING_NOTE,
        state: {
          status: LOADER_STATUS.IDLE,
        },
      }

      const content = {
        ...defaultState,
        scopedLoaderState: {
          [addingBookIdle.scope]: {
            [addingBookIdle.loader]: addingBookIdle.state,
          },
        },
      }

      expect(reducers(defaultState, actions.setScopedLoaderState(addingBookIdle))).toStrictEqual(
        content,
      )
    })

    test('should add a new loader under an existing scope without removing other loaders', () => {
      const existingEntry: { scope: string; loader: LOADER_STATE; state: LoaderState } = {
        scope: 'ID',
        loader: LOADER_STATE.IS_ADDING_NOTE,
        state: { status: LOADER_STATUS.IDLE },
      }

      const stateWithExisting = {
        ...defaultState,
        scopedLoaderState: {
          [existingEntry.scope]: {
            [existingEntry.loader]: existingEntry.state,
          },
        },
      }

      const newEntry: { scope: string; loader: LOADER_STATE; state: LoaderState } = {
        scope: 'ID',
        loader: LOADER_STATE.IS_ADDING_BOOK,
        state: { status: LOADER_STATUS.LOADING },
      }

      const result = reducers(stateWithExisting, actions.setScopedLoaderState(newEntry))

      const id = 'ID'
      expect(result.scopedLoaderState[id]).toEqual({
        [existingEntry.loader]: existingEntry.state,
        [newEntry.loader]: newEntry.state,
      })
    })

    test('should create a new scope when the given scope does not exist yet', () => {
      const newScopeEntry: { scope: string; loader: LOADER_STATE; state: LoaderState } = {
        scope: 'NEW_SCOPE',
        loader: LOADER_STATE.IS_ADDING_BOOK,
        state: { status: LOADER_STATUS.LOADING },
      }

      const result = reducers(defaultState, actions.setScopedLoaderState(newScopeEntry))

      const id = 'NEW_SCOPE'
      expect(result.scopedLoaderState[id]).toEqual({
        [newScopeEntry.loader]: newScopeEntry.state,
      })
    })
  })

  describe('setOpenChaptersDrawer', () => {
    test('should open chapters drawer', () => {
      const content = { ...defaultState, openChaptersDrawer: true }

      expect(reducers(defaultState, actions.setOpenChaptersDrawer(true))).toStrictEqual(content)
    })

    test('Should hide chapters drawer', () => {
      const content = { ...defaultState, openChaptersDrawer: false }

      expect(reducers(defaultState, actions.setOpenChaptersDrawer(false))).toStrictEqual(content)
    })
  })

  describe('setOpenSettingsModal', () => {
    test('should open settings modal', () => {
      const content = { ...defaultState, openSettingsModal: true }

      expect(reducers(defaultState, actions.setOpenSettingsModal(true))).toStrictEqual(content)
    })

    test('Should hide settings modal', () => {
      const content = { ...defaultState, openSettingsModal: false }

      expect(reducers(defaultState, actions.setOpenSettingsModal(false))).toStrictEqual(content)
    })
  })

  describe('setOpenBookOverviewModal', () => {
    test('should open book overview modal', () => {
      const data: IOpenBookOverviewModal = {
        status: false,
        format: 'EPUB',
        bookId: 'randomId',
      }

      const content = { ...defaultState, openBookOverviewModal: data }

      expect(reducers(defaultState, actions.setOpenBookOverviewModal(data))).toStrictEqual(content)
    })

    test('Should hide book overview modal', () => {
      const data: IOpenBookOverviewModal = {
        status: false,
        format: 'EPUB',
        bookId: 'randomId',
      }

      const content = { ...defaultState, openBookOverviewModal: data }

      expect(reducers(defaultState, actions.setOpenBookOverviewModal(data))).toStrictEqual(content)
    })
  })

  describe('setOpenCreateNoteModal', () => {
    test('should open create note modal', () => {
      const content = { ...defaultState, openCreateNoteModal: true }

      expect(reducers(defaultState, actions.setOpenCreateNoteModal(true))).toStrictEqual(content)
    })

    test('Should hide create note modal', () => {
      const content = { ...defaultState, openCreateNoteModal: false }

      expect(reducers(defaultState, actions.setOpenCreateNoteModal(false))).toStrictEqual(content)
    })
  })

  describe('setHideHeader', () => {
    test('Should hide header', () => {
      const hidden = { ...defaultState, hideHeader: true }

      expect(reducers(hidden, actions.setHideHeader(true))).toStrictEqual(hidden)
    })

    test('Should show header', () => {
      const hidden = { ...defaultState, hideHeader: false }

      expect(reducers(hidden, actions.setHideHeader(false))).toStrictEqual(hidden)
    })
  })

  describe('setOpenCreateBookmarkModal', () => {
    test('should open create bookmark modal', () => {
      const content = { ...defaultState, openCreateBookmarkModal: true }

      expect(reducers(defaultState, actions.setOpenCreateBookmarkModal(true))).toStrictEqual(
        content,
      )
    })

    test('Should hide create bookmark modal', () => {
      const content = { ...defaultState, openCreateBookmarkModal: false }

      expect(reducers(defaultState, actions.setOpenCreateBookmarkModal(false))).toStrictEqual(
        content,
      )
    })
  })
})
