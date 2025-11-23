import Settings from '@pages/Settings'
import { actions } from '@store/reducers/ui'
import { uiSelector } from '@store/selectors/ui'
import { useDispatch, useSelector } from 'react-redux'

const SettingsModal = () => {
  const openSettingsModal = useSelector(uiSelector.openSettingsModal)
  const dispatch = useDispatch()

  return (
    <Settings
      isOpen={openSettingsModal}
      onClickClose={() => {
        dispatch(actions.setOpenSettingsModal(false))
      }}
    />
  )
}

export default SettingsModal
