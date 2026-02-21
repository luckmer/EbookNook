import NotebookDrawer from '@pages/Drawers/NotebookDrawer'
import { actions as annotationActions } from '@store/reducers/annotations'
import { actions as uiActions } from '@store/reducers/ui'
import { annotationsSelector } from '@store/selectors/annotations'
import { uiSelector } from '@store/selectors/ui'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const NotebookDrawerRoot = () => {
  const annotationsMap = useSelector(annotationsSelector.annotations)
  const isLoader = useSelector(uiSelector.isFetchingAnnotations)
  const isOpen = useSelector(uiSelector.openNotebook)

  const location = useLocation()
  const dispatch = useDispatch()

  const bookId = useMemo(() => location?.state?.id, [location])

  const annotations = useMemo(() => {
    return Object.values(annotationsMap[bookId] ?? {})
  }, [bookId, annotationsMap])

  return (
    <NotebookDrawer
      isOpen={isOpen}
      data={annotations}
      isLoader={isLoader}
      onClickClose={() => {
        dispatch(uiActions.setOpenNotebook(false))
      }}
      onClickDelete={(id) => {
        dispatch(annotationActions.deleteAnnotationById({ id, bookId }))
      }}
    />
  )
}

export default NotebookDrawerRoot
