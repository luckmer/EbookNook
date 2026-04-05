import { Fragment } from 'react'
import BookOverviewModal from './BookOverviewModal'
import SettingsModal from './SettingsModal'

const Modals = () => {
  return (
    <Fragment>
      <SettingsModal />
      <BookOverviewModal />
    </Fragment>
  )
}

export default Modals
