import type { IBindingsNote } from '@bindings/notes'
import { describe, expect, test } from 'vitest'
import {
  actions,
  type bookId,
  defaultState,
  type ISelectedNote,
  type pageNumber,
  reducers,
} from '.'

const note: IBindingsNote = {
  value:
    'epubcfi(/6/12!/4/2/2[tagalog],/2[rw-title-block_43539-077535482],/42[rw-p_43542-151052214]/1:283)',
  bookId: '123',
  chapter: 'Chapter 1',
  color: 'red',
  createdAt: '1780510075459',
  note: 'pending note',
  noteId: '1780510075459',
  page: '1',
  text: 'Lorem ipsum',
  title: 'Book title',
  updatedAt: '1780510075459',
}

describe('bookmarksStore', () => {
  describe('load', () => {
    test('Load initial state', () => {
      expect(reducers(undefined, actions.load())).toEqual(defaultState)
    })
  })

  describe('reset', () => {
    const note: ISelectedNote = {
      cfi: 'epubcfi(/6/12!/4/2/2[tagalog],/2[rw-title-block_43539-077535482],/42[rw-p_43542-151052214]/1:283)',
      selectedAt: '1780510075459',
    }

    test('resets to initial state', () => {
      expect(reducers(undefined, actions.reset())).toEqual(defaultState)
    })

    test('resets selected note back to default', () => {
      const stateWithNote = reducers(defaultState, actions.setSelectedNote(note))

      expect(stateWithNote).toEqual({ ...defaultState, selectedNote: note })
      expect(reducers(stateWithNote, actions.reset())).toEqual(defaultState)
    })
  })

  describe('setPendingNote', () => {
    test('sets pending note', () => {
      const result = reducers(defaultState, actions.setPendingNote(note))

      expect(result.pendingNote).toEqual(note)
    })

    test('overwrites existing pending note', () => {
      const stateWithNote = reducers(defaultState, actions.setPendingNote(note))
      const updatedNote = { ...note, value: 'updated note' }
      const result = reducers(stateWithNote, actions.setPendingNote(updatedNote))

      expect(result.pendingNote).toEqual(updatedNote)
    })

    test('does not affect other state fields', () => {
      const result = reducers(defaultState, actions.setPendingNote(note))

      expect(result).toEqual({ ...defaultState, pendingNote: note })
    })
  })

  describe('setNotes', () => {
    test('set notes', () => {
      const notes: Partial<Record<bookId, Record<pageNumber, Array<IBindingsNote>>>> = {
        [note.bookId]: {
          [note.page]: [note, note, note],
        },
      }

      const result = reducers(defaultState, actions.setNotes(notes))
      expect(result).toEqual({ ...defaultState, notes })
    })

    test('sets empty notes', () => {
      const result = reducers(defaultState, actions.setNotes({}))

      expect(result.notes).toEqual({})
    })
  })

  describe('addNote', () => {
    test('dispatches without modifying state', () => {
      expect(reducers(undefined, actions.addNote(note))).toEqual(defaultState)
    })
  })

  describe('deleteNote', () => {
    test('dispatches without modifying state', () => {
      expect(
        reducers(
          undefined,
          actions.deleteNote({
            id: note.bookId,
            noteId: note.noteId,
            page: note.page,
          }),
        ),
      ).toEqual(defaultState)
    })
  })

  describe('updateNote', () => {
    test('dispatches without modifying state', () => {
      expect(reducers(undefined, actions.updateNote(note))).toEqual(defaultState)
    })
  })

  describe('setDeleteNote', () => {
    const stateWithNote = {
      ...defaultState,
      notes: { '123': { '1': [note] } },
    }

    test('removes the correct note', () => {
      const result = reducers(
        stateWithNote,
        actions.setDeleteNote({ id: '123', noteId: note.noteId, page: '1' }),
      )

      const noteShouldExist = result.notes['123']!['1']

      expect(noteShouldExist).toEqual([])
    })

    test('ignores unknown book id', () => {
      const result = reducers(
        stateWithNote,
        actions.setDeleteNote({ id: 'non-existent', noteId: note.noteId, page: '1' }),
      )

      expect(result).toEqual(stateWithNote)
    })

    test('ignores unknown note id', () => {
      const stateWithNote = { ...defaultState, notes: { '123': { '1': [note] } } }
      const result = reducers(
        stateWithNote,
        actions.setDeleteNote({ id: '123', noteId: 'non-existent', page: '1' }),
      )

      expect(result.notes['123']!['1']).toEqual([note])
    })
  })

  describe('setUpdateNote', () => {
    const stateWithNote = {
      ...defaultState,
      notes: { '123': { '1': [note] } },
    }

    test('updates the correct note', () => {
      const updatedNote = { ...note, value: 'updated note' }
      const result = reducers(stateWithNote, actions.setUpdateNote(updatedNote))

      const noteShouldExist = result.notes['123']!['1'][0]

      expect(noteShouldExist).toEqual(updatedNote)
    })

    test('ignores unknown book id', () => {
      const result = reducers(
        stateWithNote,
        actions.setUpdateNote({ ...note, bookId: 'non-existent' }),
      )

      expect(result).toEqual(stateWithNote)
    })

    test('ignores unknown note id', () => {
      const stateWithNote = { ...defaultState, notes: { '123': { '1': [note] } } }
      const result = reducers(
        stateWithNote,
        actions.setUpdateNote({ ...note, noteId: 'non-existent' }),
      )

      expect(result).toEqual(stateWithNote)
    })
  })

  describe('setSelectedNote', () => {
    test('sets selected note', () => {
      const result = reducers(
        defaultState,
        actions.setSelectedNote({
          cfi: note.value,
          selectedAt: '1780510075459',
        }),
      )
      expect(result.selectedNote).toEqual({
        cfi: note.value,
        selectedAt: '1780510075459',
      })
    })

    test('overwrites existing selected note', () => {
      const stateWithNote = reducers(
        defaultState,
        actions.setSelectedNote({
          cfi: note.value,
          selectedAt: '1780510075459',
        }),
      )

      const updatedNote: IBindingsNote = { ...note, value: 'epubcfi(/6/8!/4/2/4)' }

      const result = reducers(
        stateWithNote,
        actions.setSelectedNote({
          cfi: updatedNote.value,
          selectedAt: '1780510075459',
        }),
      )
      expect(result.selectedNote).toEqual({
        cfi: updatedNote.value,
        selectedAt: '1780510075459',
      })
    })
  })

  describe('setAddNote', () => {
    test('creates a new book entry with note when book does not exist', () => {
      const result = reducers(defaultState, actions.setAddNote(note))
      expect(result.notes['123']!['1']).toEqual([note])
    })

    test('appends note to existing page', () => {
      const stateWithNote = { ...defaultState, notes: { '123': { '1': [note] } } }
      const newNote = { ...note, noteId: '999' }
      const result = reducers(stateWithNote, actions.setAddNote(newNote))
      expect(result.notes['123']!['1']).toEqual([note, newNote])
    })

    test('creates a new page entry when page does not exist', () => {
      const stateWithNote = { ...defaultState, notes: { '123': { '1': [note] } } }
      const noteOnNewPage = { ...note, page: '2' }
      const result = reducers(stateWithNote, actions.setAddNote(noteOnNewPage))
      expect(result.notes['123']!['2']).toEqual([noteOnNewPage])
    })
  })
})
