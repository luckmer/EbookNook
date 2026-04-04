import { Epub } from '@bindings/epub'
import { Highlights } from '@bindings/highlights'
import { Notes } from '@bindings/notes'
import { ANNOTATIONS_STATUS } from '@interfaces/annotations/enums'
import { PayloadAction } from '@reduxjs/toolkit'
import { actions, PayloadTypes } from '@store/reducers/annotations'
import { actions as uiActions } from '@store/reducers/ui'
import { annotationsSelector } from '@store/selectors/annotations'
import { selectEpubMap } from '@store/selectors/books'
import { invoke } from '@tauri-apps/api/core'
import { notify } from '@utils/notification'
import { all, call, put, select, takeEvery, takeLatest } from 'typed-redux-saga'

export function* getNotesStructureById(id: string, book: Epub) {
  try {
    const notes = yield* select(annotationsSelector.notes)
    const bookNotes = notes[id] ?? []
    if (bookNotes.length > 0) {
      yield* put(uiActions.setIsFetchingNotesStructure(false))
      return
    }
    const response = yield* call(invoke<Notes>, 'get_notes_structure_by_id', {
      id: book?.book.id,
    })

    yield* put(actions.setNotes({ id: id, notes: response }))
  } catch (err) {
    console.log('err', err)
    notify('Failed to get notes structure', 'error')
  }
}

export function* getHighlightsStructureById(id: string, book: Epub) {
  try {
    const highlights = yield* select(annotationsSelector.highlights)
    const booksHighlights = highlights[id] ?? []
    if (booksHighlights.length > 0) {
      yield* put(uiActions.setIsFetchingHighlightsStructure(false))
      return
    }

    const response = yield* call(invoke<Highlights>, 'get_highlights_structure_by_id', {
      id: book?.book.id,
    })
    yield* put(actions.setHighlights({ id: id, highlights: response }))
  } catch (err) {
    console.log('err', err)
    notify('Failed to get highlights structure', 'error')
  }
}

export function* getAnnotationStructureById(
  action: PayloadAction<PayloadTypes['getAnnotationStructure']>,
) {
  const bookMap = yield* select(selectEpubMap)
  const book = bookMap[action.payload]
  if (!book) {
    yield* put(uiActions.setIsFetchingNotesStructure(false))
    yield* put(uiActions.setIsFetchingHighlightsStructure(false))
    return
  }

  yield* all([
    call(getNotesStructureById, action.payload, book),
    call(getHighlightsStructureById, action.payload, book),
  ])

  yield* put(uiActions.setIsFetchingNotesStructure(false))
  yield* put(uiActions.setIsFetchingHighlightsStructure(false))
}

export function* setHighlight(action: PayloadAction<PayloadTypes['setHighlight']>) {
  const highlightId = action.payload.highlight.id

  try {
    yield* put(actions.setStatus({ id: action.payload.id, status: ANNOTATIONS_STATUS.PENDING }))
    yield* call(invoke, 'add_highlight_structure', {
      highlight: action.payload.highlight,
      id: action.payload.id,
    })

    yield* put(actions.setStatus({ id: action.payload.id, status: ANNOTATIONS_STATUS.SUCCESS }))
    yield* put(actions.removeHighlightPendingStatus({ id: action.payload.id, highlightId }))
  } catch (err) {
    console.log('err', err)
    notify('Failed to add highlight', 'error')
    yield* all([
      put(actions.removeHighlightById({ id: highlightId, bookId: action.payload.id })),
      put(actions.setStatus({ id: action.payload.id, status: ANNOTATIONS_STATUS.ERROR })),
    ])
  }
}

export function* deleteHighlightById(
  action: PayloadAction<PayloadTypes['setDeleteHighlightById']>,
) {
  try {
    yield* put(actions.setStatus({ id: action.payload.id, status: ANNOTATIONS_STATUS.PENDING }))
    yield* call(invoke, 'delete_highlight_by_id', {
      id: action.payload.id,
      bookId: action.payload.bookId,
    })
    yield* all([
      put(actions.deleteHighlightById(action.payload)),
      put(actions.setStatus({ id: action.payload.id, status: ANNOTATIONS_STATUS.SUCCESS })),
    ])
  } catch (err) {
    console.log('err', err)
    yield* put(actions.setStatus({ id: action.payload.id, status: ANNOTATIONS_STATUS.ERROR }))
    notify('Failed to delete highlight', 'error')
  }
}

export function* deleteNoteById(action: PayloadAction<PayloadTypes['setDeleteNoteById']>) {
  try {
    yield* put(actions.setStatus({ id: action.payload.id, status: ANNOTATIONS_STATUS.PENDING }))
    yield* call(invoke, 'delete_note_by_id', {
      id: action.payload.id,
      bookId: action.payload.bookId,
    })
    yield* all([
      put(actions.deleteNoteById(action.payload)),
      put(actions.setStatus({ id: action.payload.id, status: ANNOTATIONS_STATUS.SUCCESS })),
    ])
  } catch (err) {
    console.log('err', err)
    notify('Failed to delete note by id', 'error')
    yield* all([
      put(actions.setStatus({ id: action.payload.id, status: ANNOTATIONS_STATUS.ERROR })),
    ])
  }
}

export function* saveNote(action: PayloadAction<PayloadTypes['setSaveNote']>) {
  try {
    yield* put(
      actions.setStatus({ id: action.payload.note.id, status: ANNOTATIONS_STATUS.PENDING }),
    )
    yield* call(invoke, 'add_note_structure', {
      note: action.payload.note,
      id: action.payload.id,
    })
    yield* all([
      put(actions.saveNote(action.payload)),
      put(actions.setStatus({ id: action.payload.note.id, status: ANNOTATIONS_STATUS.SUCCESS })),
    ])
  } catch (err) {
    console.log('err', err)
    notify('Failed to add note', 'error')
    yield* all([
      put(actions.setStatus({ id: action.payload.note.id, status: ANNOTATIONS_STATUS.ERROR })),
    ])
  }
}

export function* getAnnotationStructureSaga() {
  yield* takeLatest(actions.getAnnotationStructure, getAnnotationStructureById)
}

export function* setHighlightSaga() {
  yield* takeEvery(actions.setHighlight, setHighlight)
}

export function* deleteHighlightByIdSaga() {
  yield* takeEvery(actions.setDeleteHighlightById, deleteHighlightById)
}

export function* deleteNoteByIdSaga() {
  yield* takeEvery(actions.setDeleteNoteById, deleteNoteById)
}

export function* saveNoteSaga() {
  yield* takeEvery(actions.setSaveNote, saveNote)
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
