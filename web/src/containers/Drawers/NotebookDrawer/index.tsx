import NotebookDrawer from '@pages/Drawers/NotebookDrawer'
import { actions as annotationActions } from '@store/reducers/annotations'
import { actions as uiActions } from '@store/reducers/ui'
import { annotationsSelector } from '@store/selectors/annotations'
import { uiSelector } from '@store/selectors/ui'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { v7 } from 'uuid'

const NotebookDrawerRoot = () => {
  const annotationsMap = useSelector(annotationsSelector.annotations)
  const isLoader = useSelector(uiSelector.isFetchingAnnotations)
  const annotationId = useSelector(annotationsSelector.newAnnotationId)
  const isOpen = useSelector(uiSelector.openNotebook)

  const location = useLocation()
  const dispatch = useDispatch()

  const bookId = useMemo(() => location?.state?.id, [location])

  const annotations = useMemo(() => {
    return Object.values(annotationsMap[bookId] ?? {}).filter((el) => !el.annotated)
  }, [bookId, annotationsMap])

  const notes = useMemo(() => {
    return Object.values(annotationsMap[bookId] ?? {}).filter((el) => !!el.annotated)
  }, [bookId, annotationsMap])

  return (
    <NotebookDrawer
      isOpen={isOpen}
      data={annotations}
      notes={notes}
      noteId={annotationId}
      isLoader={isLoader}
      onClickClose={() => {
        if (annotationId.trim().length > 0) {
          dispatch(annotationActions.deleteAnnotationById({ id: annotationId, bookId }))
          dispatch(annotationActions.setAnnotationId(''))
        }
        dispatch(uiActions.setOpenNotebook(false))
      }}
      onClickDelete={(id) => {
        dispatch(annotationActions.deleteAnnotationById({ id, bookId }))
      }}
      onClickCancel={() => {
        dispatch(uiActions.setOpenNotebook(false))
        if (annotationId.trim().length > 0) {
          dispatch(annotationActions.deleteAnnotationById({ id: annotationId, bookId }))
          dispatch(annotationActions.setAnnotationId(''))
        }
      }}
      onClickFocus={() => {
        dispatch(uiActions.setOpenNotebook(false))
      }}
      onClickSave={(description, label) => {
        dispatch(annotationActions.setAnnotationId(''))
        dispatch(uiActions.setOpenNotebook(false))
        dispatch(
          annotationActions.setAnnotation({
            id: bookId,
            updateAnnotation: true,
            annotation: {
              label,
              description,
              id: annotationId ?? v7(),
              annotated: true,
            },
          }),
        )
      }}
    />
  )
}

export default NotebookDrawerRoot
