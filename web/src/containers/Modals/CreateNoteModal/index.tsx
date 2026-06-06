import type { IBindingsNote } from '@bindings/notes'
import CreateNoteModal from '@pages/Modals/CreateNoteModal'
import { actions as noteActions } from '@store/reducers/notes'
import { actions as uiActions } from '@store/reducers/ui'
import { booksSelector } from '@store/selectors/books'
import { notesSelector } from '@store/selectors/notes'
import { uiSelector } from '@store/selectors/ui'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
export interface ICache {
  id: string
}
const CreateNoteModalRoot = () => {
  const [cache, setCache] = useState<ICache | null>(null)

  const isOpen = useSelector(uiSelector.openCreateNoteModal)
  const books = useSelector(booksSelector.books)
  const pendingNote = useSelector(notesSelector.pendingNote)

  const dispatch = useDispatch()
  const location = useLocation()

  const bookState = useMemo(() => location?.state, [location])

  const activeBook = useMemo(() => {
    if (!cache) return

    const book = books[cache.id]

    if (!book) return

    return book
  }, [cache, books])

  useEffect(() => {
    if (!bookState) return
    if (bookState.id !== cache?.id) {
      setCache(bookState)
    }
  }, [bookState, cache])

  return (
    <CreateNoteModal
      book={activeBook?.metadata?.title ?? '--'}
      isOpen={isOpen}
      onClickClose={() => {
        dispatch(uiActions.setOpenCreateNoteModal(false))
      }}
      onClickSaveNote={(title, color) => {
        if (!activeBook) {
          return
        }

        const note: IBindingsNote = {
          createdAt: Date.now().toString(),
          updatedAt: Date.now().toString(),
          noteId: Date.now().toString(),
          value: pendingNote.value,
          page: pendingNote.page,
          text: pendingNote.text,
          bookId: activeBook.id,
          chapter: 'Note',
          color,
          note: '',
          title,
        }

        dispatch(noteActions.addNote(note))
        dispatch(uiActions.setOpenCreateNoteModal(false))
      }}
      createdAt={Date.now().toString()}
      selectedText={pendingNote.text}
    />
  )
}

export default CreateNoteModalRoot
