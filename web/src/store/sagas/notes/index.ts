import type { IBindingsNote } from '@bindings/notes'
import { LOADER_STATE, LOADER_STATUS } from '@interfaces/ui/enums'
import type { PayloadAction } from '@reduxjs/toolkit'
import { actions, type PayloadTypes } from '@store/reducers/notes'
import { actions as uiActions } from '@store/reducers/ui'
import { notesSelector } from '@store/selectors/notes'
import { invoke } from '@tauri-apps/api/core'
import { notify } from '@utils/notification'
import { all, call, put, select, takeEvery } from 'typed-redux-saga'

export function* getNotesByBookId(id: string) {
  try {
    if (!id.trim().length) {
      return
    }

    const notes = yield* select(notesSelector.notes)

    if (notes[id] && Object.values(notes[id]).length > 0) {
      return
    }

    const response = yield* call(invoke<IBindingsNote[]>, 'get_notes_by_book_id', { id })

    const notesData: Record<string, Record<string, Array<IBindingsNote>>> = {}

    for (const note of response) {
      if (!notesData[id]) {
        notesData[id] = {}
      }

      if (!notesData[id][note.page]) {
        notesData[id][note.page] = []
      }

      notesData[id][note.page].push(note)
    }

    yield* put(actions.setNotes(notesData))
  } catch (err) {
    console.log('Failed to load notes state', err)
    notify('Failed to load notes state', 'error')
  }
}

export function* addNote(action: PayloadAction<PayloadTypes['addNote']>) {
  yield* put(
    uiActions.setScopedLoaderState({
      scope: action.payload.bookId,
      loader: LOADER_STATE.IS_ADDING_NOTE,
      state: { status: LOADER_STATUS.LOADING },
    }),
  )

  try {
    yield* call(invoke<IBindingsNote>, 'add_note', { note: action.payload })
    yield* put(actions.setAddNote(action.payload))
  } catch (err) {
    console.log('Failed to save note', err)
    notify('Failed to save note', 'error')
  }

  yield* put(
    uiActions.setScopedLoaderState({
      scope: action.payload.bookId,
      loader: LOADER_STATE.IS_ADDING_NOTE,
      state: { status: LOADER_STATUS.IDLE },
    }),
  )
}

export function* addNoteSaga() {
  yield* takeEvery(actions.addNote, addNote)
}

export default function* rootSaga() {
  yield all([addNoteSaga()])
}
