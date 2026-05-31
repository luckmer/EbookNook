import { createSelector } from '@reduxjs/toolkit'
import { bookmarksSelector } from '@store/selectors/bookmarks'
import { notesSelector } from '@store/selectors/notes'

export const getSelectedAnnotation = createSelector(
  [bookmarksSelector.selectedBookmark, notesSelector.selectedNote],
  (selectedBookmark, selectedNote) => {
    const bookmarkTime = selectedBookmark.selectedAt ?? 0
    const noteTime = selectedNote.selectedAt ?? 0

    const newest = bookmarkTime >= noteTime ? selectedBookmark : selectedNote

    return {
      cfi: newest.cfi,
      selectedAt: newest.selectedAt,
    }
  },
)
