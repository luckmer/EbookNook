import { Fragment } from 'react'
import BookOverviewModal from './BookOverviewModal'
import CreateBookmarkModal from './CreateBookmarkModal'
import SettingsModal from './SettingsModal'

const Modals = () => {
  return (
    <Fragment>
      <SettingsModal />
      <CreateBookmarkModal />
      <BookOverviewModal />
    </Fragment>
  )
}

export default Modals
