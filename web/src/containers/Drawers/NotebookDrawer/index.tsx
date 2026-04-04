import { ANNOTATIONS_STATUS } from '@interfaces/annotations/enums'
import NotebookDrawer from '@pages/Drawers/NotebookDrawer'
import { actions as annotationActions } from '@store/reducers/annotations'
import { actions as uiActions } from '@store/reducers/ui'
import { annotationsSelector } from '@store/selectors/annotations'
import { uiSelector } from '@store/selectors/ui'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const NotebookDrawerRoot = () => {
  const isFetchingHighlightsStructure = useSelector(uiSelector.isFetchingHighlightsStructure)
  const isFetchingNotesStructure = useSelector(uiSelector.isFetchingNotesStructure)
  const selectedAnnotation = useSelector(annotationsSelector.selectedAnnotation)
  const highlightsMap = useSelector(annotationsSelector.highlights)
  const status = useSelector(annotationsSelector.statuses)
  const notesMap = useSelector(annotationsSelector.notes)
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

  const hasInvalidNotes = useMemo(() => {
    return notes
      .filter((note) => {
        const pending = status[note.id] === ANNOTATIONS_STATUS.PENDING
        return note.label === '' && !pending
      })
      .map((note) => note.id)
  }, [notes, status])

  return (
    <NotebookDrawer
      isOpen={isOpen}
      highlights={highlights}
      notes={notes}
      isFetchingNotesStructure={isFetchingNotesStructure}
      isFetchingHighlightsStructure={isFetchingHighlightsStructure}
      getStatus={(id) => status[id]}
      onClickDeleteHighlight={(id) => {
        dispatch(annotationActions.setDeleteHighlightById({ id, bookId }))
      }}
      onClickDeleteNote={(id) => {
        dispatch(annotationActions.setDeleteNoteById({ id, bookId }))
        if (selectedAnnotation !== null && selectedAnnotation.anchorId === id) {
          dispatch(annotationActions.setSelectedAnnotation(null))
        }
      }}
      onClickClose={() => {
        if (hasInvalidNotes.length > 0) {
          dispatch(annotationActions.deleteNotesByIds({ ids: hasInvalidNotes, bookId }))
        }

        dispatch(uiActions.setOpenNotebook(false))
      }}
      onClickCancel={() => {
        if (hasInvalidNotes.length > 0) {
          dispatch(annotationActions.deleteNotesByIds({ ids: hasInvalidNotes, bookId }))
        }
        dispatch(uiActions.setOpenNotebook(false))
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
        dispatch(
          annotationActions.setSaveNote({
            id: bookId,
            note: {
              ...note,
              label,
            },
          }),
        )
        console.log(note, status)
      }}
    />
  )
}

export default NotebookDrawerRoot
