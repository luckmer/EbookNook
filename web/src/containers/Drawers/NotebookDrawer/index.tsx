import NotebookDrawer from '@pages/Drawers/NotebookDrawer'
import { actions as uiActions } from '@store/reducers/ui'
import { annotationsSelector } from '@store/selectors/annotations'
import { uiSelector } from '@store/selectors/ui'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const NotebookDrawerRoot = () => {
  const annotationsMap = useSelector(annotationsSelector.annotations)
  const isOpen = useSelector(uiSelector.openNotebook)

  const location = useLocation()
  const dispatch = useDispatch()

  const bookId = useMemo(() => location?.state?.id, [location])

  const annotations = useMemo(() => {
    // return Object.values(annotationsMap[bookId] ?? {})
  }, [bookId, annotationsMap])

  return (
    <NotebookDrawer
      isOpen={isOpen}
      onClickClose={() => {
        dispatch(uiActions.setOpenNotebook(false))
      }}
    />
  )
}

export default NotebookDrawerRoot
