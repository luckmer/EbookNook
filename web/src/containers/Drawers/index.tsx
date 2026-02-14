import { Fragment } from 'react/jsx-runtime'
import ChaptersDrawerRoot from './chaptersDrawer'
import NotebookDrawerRoot from './NotebookDrawer'

const DrawersRoot = () => {
  return (
    <Fragment>
      <ChaptersDrawerRoot />
      <NotebookDrawerRoot />
    </Fragment>
  )
}

export default DrawersRoot
