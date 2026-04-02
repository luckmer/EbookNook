import { Epub } from '@bindings/epub'
import { Highlights } from '@bindings/highlights'
import { Notes } from '@bindings/notes'
import { NOTIFICATION_TYPE } from '@interfaces/notifications/enums'
import { PayloadAction } from '@reduxjs/toolkit'
import { actions, PayloadTypes } from '@store/reducers/annotations'
import { actions as notificationActions } from '@store/reducers/notifications'
import { actions as uiActions } from '@store/reducers/ui'
import { annotationsSelector } from '@store/selectors/annotations'
import { selectEpubMap } from '@store/selectors/books'
import { invoke } from '@tauri-apps/api/core'
import { all, call, put, select, takeEvery, takeLatest } from 'typed-redux-saga'

export function* getNotesStructureById(id: string, book: Epub) {
  try {
    const notes = yield* select(annotationsSelector.notes)
    const bookNotes = notes[id] ?? []
    if (bookNotes.length > 0) {
      yield* put(uiActions.setIsFetchingAnnotationsStructure(false))
      return
    }
    const response = yield* call(invoke<Notes>, 'get_notes_structure_by_id', {
      id: book?.book.id,
    })

    yield* put(actions.setNotes({ id: id, notes: response }))
  } catch (err) {
    console.log('err', err)
    yield* put(
      notificationActions.setNotification({
        message: 'Failed to get notes structure',
        type: NOTIFICATION_TYPE.ERROR,
        duration: 2000,
        id: Date.now(),
      }),
    )
  }
}

export function* getHighlightsStructureById(id: string, book: Epub) {
  try {
    const highlights = yield* select(annotationsSelector.highlights)
    const booksHighlights = highlights[id] ?? []
    if (booksHighlights.length > 0) {
      yield* put(uiActions.setIsFetchingAnnotationsStructure(false))
      return
    }

    const response = yield* call(invoke<Highlights>, 'get_highlights_structure_by_id', {
      id: book?.book.id,
    })
    yield* put(actions.setHighlights({ id: id, highlights: response }))
  } catch (err) {
    console.log('err', err)
    yield* put(
      notificationActions.setNotification({
        message: 'Failed to get highlights structure',
        type: NOTIFICATION_TYPE.ERROR,
        duration: 2000,
        id: Date.now(),
      }),
    )
  }
}

export function* getAnnotationStructureById(
  action: PayloadAction<PayloadTypes['getAnnotationStructure']>,
) {
  const bookMap = yield* select(selectEpubMap)
  const book = bookMap[action.payload]
  if (!book) {
    yield* put(uiActions.setIsFetchingAnnotationsStructure(false))
    return
  }

  yield* all([
    call(getNotesStructureById, action.payload, book),
    call(getHighlightsStructureById, action.payload, book),
  ])

  yield* put(uiActions.setIsFetchingAnnotationsStructure(false))
}

export function* setHighlight(action: PayloadAction<PayloadTypes['setHighlight']>) {
  try {
    yield* call(invoke, 'add_highlight_structure', {
      highlight: action.payload.highlight,
      id: action.payload.id,
    })
  } catch (err) {
    console.log('err', err)
    yield* put(
      notificationActions.setNotification({
        message: 'Failed to add highlight',
        type: NOTIFICATION_TYPE.ERROR,
        duration: 2000,
        id: Date.now(),
      }),
    )
  }

  yield* put(uiActions.setIsFetchingStructure(false))
}

export function* deleteHighlightById(action: PayloadAction<PayloadTypes['deleteHighlightById']>) {
  try {
    yield* call(invoke, 'delete_highlight_by_id', {
      id: action.payload.id,
      bookId: action.payload.bookId,
    })
  } catch (err) {
    console.log('err', err)
    yield* put(
      notificationActions.setNotification({
        message: 'Failed to delete highlight',
        type: NOTIFICATION_TYPE.ERROR,
        duration: 2000,
        id: Date.now(),
      }),
    )
  }
}

export function* deleteNoteById(action: PayloadAction<PayloadTypes['deleteNoteById']>) {
  try {
    yield* call(invoke, 'delete_note_by_id', {
      id: action.payload.id,
      bookId: action.payload.bookId,
    })
  } catch (err) {
    console.log('err', err)
    yield* put(
      notificationActions.setNotification({
        message: 'Failed to delete note by id',
        type: NOTIFICATION_TYPE.ERROR,
        duration: 2000,
        id: Date.now(),
      }),
    )
  }
}

export function* saveNote(action: PayloadAction<PayloadTypes['saveNote']>) {
  try {
    yield* call(invoke, 'add_note_structure', {
      note: action.payload.note,
      id: action.payload.id,
    })
  } catch (err) {
    console.log('err', err)
    yield* put(
      notificationActions.setNotification({
        message: 'Failed to add note',
        type: NOTIFICATION_TYPE.ERROR,
        duration: 2000,
        id: Date.now(),
      }),
    )
  }
}

export function* getAnnotationStructureSaga() {
  yield* takeLatest(actions.getAnnotationStructure, getAnnotationStructureById)
}

export function* setHighlightSaga() {
  yield* takeEvery(actions.setHighlight, setHighlight)
}

export function* deleteHighlightByIdSaga() {
  yield* takeEvery(actions.deleteHighlightById, deleteHighlightById)
}

export function* deleteNoteByIdSaga() {
  yield* takeEvery(actions.deleteNoteById, deleteNoteById)
}

export function* saveNoteSaga() {
  yield* takeEvery(actions.saveNote, saveNote)
}

export default function* RootSaga() {
  yield all([
    getAnnotationStructureSaga(),
    setHighlightSaga(),
    deleteHighlightByIdSaga(),
    deleteNoteByIdSaga(),
    saveNoteSaga(),
  ])
}
