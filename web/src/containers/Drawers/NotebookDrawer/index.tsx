import NotebookDrawer from '@pages/Drawers/NotebookDrawer'
import { actions as annotationActions } from '@store/reducers/annotations'
import { actions as uiActions } from '@store/reducers/ui'
import { annotationsSelector } from '@store/selectors/annotations'
import { uiSelector } from '@store/selectors/ui'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const NotebookDrawerRoot = () => {
  const selectedAnnotation = useSelector(annotationsSelector.selectedAnnotation)
  const highlightsMap = useSelector(annotationsSelector.highlights)
  const notesMap = useSelector(annotationsSelector.notes)
  const isLoader = useSelector(uiSelector.isFetchingAnnotations)
  const editingNoteId = useSelector(annotationsSelector.editingNoteId)
  const isOpen = useSelector(uiSelector.openNotebook)
  const location = useLocation()
  const dispatch = useDispatch()

  const bookId = useMemo(() => location?.state?.id, [location])

  const highlights = useMemo(() => {
    return highlightsMap[bookId] ?? []
  }, [bookId, highlightsMap])

  const notes = useMemo(() => {
    return notesMap[bookId] ?? []
  }, [notesMap, bookId])

  return (
    <NotebookDrawer
      isOpen={isOpen}
      highlights={highlights}
      notes={notes}
      editingNoteId={editingNoteId ?? ''}
      isLoader={isLoader}
      onClickDeleteHighlight={(id) => {
        dispatch(annotationActions.deleteHighlightById({ id, bookId }))
      }}
      onClickDeleteNote={(id) => {
        dispatch(annotationActions.deleteNoteById({ id, bookId }))
        if (selectedAnnotation !== null && selectedAnnotation.anchorId === id) {
          dispatch(annotationActions.setSelectedAnnotation(null))
        }
      }}
      onClickClose={() => {
        if (editingNoteId !== null) {
          dispatch(annotationActions.deleteNoteById({ id: editingNoteId, bookId }))
          dispatch(annotationActions.setEditingNoteId(null))
        }
        dispatch(uiActions.setOpenNotebook(false))
      }}
      onClickCancel={() => {
        dispatch(uiActions.setOpenNotebook(false))
        if (editingNoteId !== null) {
          dispatch(annotationActions.deleteNoteById({ id: editingNoteId, bookId }))
          dispatch(annotationActions.setEditingNoteId(null))
        }
      }}
      onClickFocusNote={(note) => {
        dispatch(uiActions.setOpenNotebook(false))
        dispatch(
          annotationActions.setSelectedAnnotation({
            anchorId: note.id,
            anchor: {
              normEnd: note.normEnd,
              normStart: note.normStart,
              text: note.description,
            },
          }),
        )
      }}
      onClickSave={(label, note) => {
        if (editingNoteId === null) {
          return
        }

        dispatch(annotationActions.setEditingNoteId(null))
        dispatch(uiActions.setOpenNotebook(false))
        dispatch(
          annotationActions.saveNote({
            id: bookId,
            note: {
              ...note,
              id: editingNoteId,
              label,
            },
          }),
        )
      }}
    />
  )
}

export default NotebookDrawerRoot
