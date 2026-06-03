import type { IBindingsBookmark } from '@bindings/bookmarks'
import { describe, expect, test } from 'vitest'
import { actions, defaultState, type ISelectedBookmark, reducers } from '.'

const baseBookmark: IBindingsBookmark = {
  bookId: '123',
  cfi: 'epubcfi(/6/12!/4/2/2[tagalog],/2[rw-title-block_43539-077535482],/42[rw-p_43542-151052214]/1:283)',
  chapter: 'Chapter 1',
  createdAt: Date.now().toString(),
  updatedAt: Date.now().toString(),
  format: 'EPUB',
  title: 'Book title',
}

const selectedBookmark: ISelectedBookmark = {
  cfi: 'epubcfi(/6/12!/4/2/2[tagalog],/2[rw-title-block_43539-077535482],/42[rw-p_43542-151052214]/1:283)',
  selectedAt: '1780510075459',
  hasChapter: true,
}

describe('bookmarksStore', () => {
  describe('load', () => {
    test('Load initial state', () => {
      expect(reducers(undefined, actions.load())).toEqual(defaultState)
    })
  })

  describe('reset', () => {
    test('Reset initial state', () => {
      expect(reducers(undefined, actions.reset())).toEqual(defaultState)
    })

    test('does not clear bookmarks on reset', () => {
      const stateWithBookmarks = reducers(defaultState, actions.setAddBookmark(baseBookmark))
      const result = reducers(stateWithBookmarks, actions.reset())

      expect(result.bookmarks['123']).toEqual([baseBookmark])
      expect(result.selectedBookmark).toEqual(defaultState.selectedBookmark)
    })

    test('Reset initial state with bookmarks', () => {
      const stateWithBookmark = reducers(
        defaultState,
        actions.setSelectedBookmark(selectedBookmark),
      )

      expect(stateWithBookmark).toEqual({ ...defaultState, selectedBookmark })
      expect(reducers(stateWithBookmark, actions.reset())).toEqual(defaultState)
    })
  })

  describe('setSelectedBookmark', () => {
    test('Set custom bookmark', () => {
      const stateWithBookmark = reducers(
        defaultState,
        actions.setSelectedBookmark(selectedBookmark),
      )
      expect(stateWithBookmark).toEqual({ ...defaultState, selectedBookmark })
    })
  })

  describe('setDeleteBookmark', () => {
    const bookmarkB: IBindingsBookmark = {
      ...baseBookmark,
      cfi: 'epubcfi(/6/8!/4/2/4)',
      chapter: 'Chapter 2',
    }

    const bookmarkC: IBindingsBookmark = {
      ...baseBookmark,
      cfi: 'epubcfi(/6/4!/4/2/6)',
      chapter: 'Chapter 3',
    }

    const stateWithBookmarks = {
      ...defaultState,
      bookmarks: {
        '123': [baseBookmark, bookmarkB, bookmarkC],
      },
    }

    test('removes the correct bookmark', () => {
      const result = reducers(
        stateWithBookmarks,
        actions.setDeleteBookmark({ id: '123', cfi: baseBookmark.cfi }),
      )

      expect(result.bookmarks['123']).toEqual([bookmarkB, bookmarkC])
    })

    test('keeps other bookmarks in the same book', () => {
      const result = reducers(
        stateWithBookmarks,
        actions.setDeleteBookmark({ id: '123', cfi: bookmarkB.cfi }),
      )

      expect(result.bookmarks['123']).toContainEqual(baseBookmark)
      expect(result.bookmarks['123']).toContainEqual(bookmarkC)
      expect(result.bookmarks['123']).not.toContainEqual(bookmarkB)
    })

    test('handles removing the last bookmark', () => {
      const singleBookmarkState = {
        ...defaultState,
        bookmarks: { '123': [baseBookmark] },
      }

      const result = reducers(
        singleBookmarkState,
        actions.setDeleteBookmark({ id: '123', cfi: baseBookmark.cfi }),
      )

      expect(result.bookmarks['123']).toEqual([])
    })

    test('does not touch bookmarks from other books', () => {
      const multiIdState = {
        ...defaultState,
        bookmarks: {
          '123': [baseBookmark],
          '456': [bookmarkB],
        },
      }

      const result = reducers(
        multiIdState,
        actions.setDeleteBookmark({ id: '123', cfi: baseBookmark.cfi }),
      )

      expect(result.bookmarks['456']).toEqual([bookmarkB])
    })

    test('ignores unknown book id', () => {
      const result = reducers(
        stateWithBookmarks,
        actions.setDeleteBookmark({ id: 'non-existent', cfi: baseBookmark.cfi }),
      )

      expect(result).toEqual(stateWithBookmarks)
    })

    test('ignores unknown cfi', () => {
      const result = reducers(
        stateWithBookmarks,
        actions.setDeleteBookmark({ id: '123', cfi: 'epubcfi(/non/existent)' }),
      )

      expect(result.bookmarks['123']).toEqual([baseBookmark, bookmarkB, bookmarkC])
    })
  })

  describe('setUpdateBookmark', () => {
    const stateWithBookmarks = {
      ...defaultState,
      bookmarks: { '123': [baseBookmark] },
    }

    test('updates the correct bookmark', () => {
      const updatedBookmark = { ...baseBookmark, chapter: 'Chapter 2' }
      const result = reducers(stateWithBookmarks, actions.setUpdateBookmark(updatedBookmark))

      const data = result.bookmarks['123']![0]

      expect(data).not.toBeUndefined()
      expect(data).not.toBeNull()

      expect(result.bookmarks['123']![0]).toEqual(updatedBookmark)
    })

    test('ignores unknown book id', () => {
      const result = reducers(
        stateWithBookmarks,
        actions.setUpdateBookmark({ ...baseBookmark, bookId: 'non-existent' }),
      )

      expect(result).toEqual(stateWithBookmarks)
    })

    test('ignores unknown cfi', () => {
      const result = reducers(
        stateWithBookmarks,
        actions.setUpdateBookmark({ ...baseBookmark, cfi: 'epubcfi(/non/existent)' }),
      )

      expect(result).toEqual(stateWithBookmarks)
    })
  })

  describe('setAddBookmark', () => {
    test('adds bookmark to an existing book', () => {
      const stateWithBookmarks = {
        ...defaultState,
        bookmarks: { '123': [baseBookmark] },
      }

      const newBookmark = { ...baseBookmark, cfi: 'epubcfi(/6/8!/4/2/4)' }
      const result = reducers(stateWithBookmarks, actions.setAddBookmark(newBookmark))

      expect(result.bookmarks['123']).toEqual([baseBookmark, newBookmark])
    })

    test('creates a new book entry when book id does not exist', () => {
      const result = reducers(defaultState, actions.setAddBookmark(baseBookmark))

      expect(result.bookmarks['123']).toEqual([baseBookmark])
    })
  })

  describe('updateBookmark', () => {
    test('dispatches without modifying state', () => {
      expect(reducers(undefined, actions.updateBookmark(baseBookmark))).toEqual(defaultState)
    })
  })

  describe('deleteBookmark', () => {
    test('dispatches without modifying state', () => {
      expect(
        reducers(undefined, actions.deleteBookmark({ id: '123', cfi: baseBookmark.cfi })),
      ).toEqual(defaultState)
    })
  })

  describe('addBookmarkById', () => {
    test('dispatches without modifying state', () => {
      expect(reducers(undefined, actions.addBookmarkById(baseBookmark))).toEqual(defaultState)
    })
  })

  describe('setBookmarks', () => {
    test('sets bookmarks for a given book id', () => {
      const bookmarkB: IBindingsBookmark = {
        ...baseBookmark,
        cfi: 'epubcfi(/6/8!/4/2/4)',
        chapter: 'Chapter 2',
      }

      const bookmarkC: IBindingsBookmark = {
        ...baseBookmark,
        cfi: 'epubcfi(/6/4!/4/2/6)',
        chapter: 'Chapter 3',
      }

      const state = {
        id: '123',
        bookmarks: [baseBookmark, bookmarkB, bookmarkC],
      }

      const stateWithBookmarks = {
        ...defaultState,
        bookmarks: {
          '123': [baseBookmark, bookmarkB, bookmarkC],
        },
      }

      expect(reducers(defaultState, actions.setBookmarks(state))).toEqual(stateWithBookmarks)
    })

    test('overwrites existing bookmarks for a given book id', () => {
      const stateWithBookmarks = {
        ...defaultState,
        bookmarks: { '123': [baseBookmark] },
      }

      const newBookmark = { ...baseBookmark, cfi: 'epubcfi(/6/8!/4/2/4)' }
      const result = reducers(
        stateWithBookmarks,
        actions.setBookmarks({ id: '123', bookmarks: [newBookmark] }),
      )

      expect(result.bookmarks['123']).toEqual([newBookmark])
    })
  })
})
