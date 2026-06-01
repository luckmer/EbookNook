import { Fragment } from 'react'
import BookOverviewModal from './BookOverviewModal'
import CreateBookmarkModal from './CreateBookmarkModal'
import CreateNoteModal from './CreateNoteModal'
import SettingsModal from './SettingsModal'

const Modals = () => {
  return (
    <Fragment>
      <SettingsModal />
      <CreateBookmarkModal />
      <CreateNoteModal />
      <BookOverviewModal />
    </Fragment>
  )
}

export default Modals
