import type { IBindingsNote } from '@bindings/notes'
import { actions } from '@store/reducers/notes'
import { notesSelector } from '@store/selectors/notes'
import { invoke } from '@tauri-apps/api/core'
import { notify } from '@utils/notification'
import { all, call, put, select } from 'typed-redux-saga'

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

export default function* rootSaga() {
  yield all([])
}
