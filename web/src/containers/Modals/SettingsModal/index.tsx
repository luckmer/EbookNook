import { SETTINGS } from '@interfaces/settings/enums'
import Settings from '@pages/Settings'
import { actions } from '@store/reducers/ui'
import { actions as settingsActions } from '@store/reducers/settings'
import { settingsSelector } from '@store/selectors/settings'
import { uiSelector } from '@store/selectors/ui'
import { useDispatch, useSelector } from 'react-redux'

const SettingsModal = () => {
  const openSettingsModal = useSelector(uiSelector.openSettingsModal)
  const defaultFontSize = useSelector(settingsSelector.defaultFontSize)
  const fontWeight = useSelector(settingsSelector.fontWeight)
  const dispatch = useDispatch()

  return (
    <Settings
      isOpen={openSettingsModal}
      defaultFontSize={defaultFontSize}
      fontWeight={fontWeight}
      onClick={(action, value) => {
        switch (action) {
          case SETTINGS.DEFAULT_FONT_SIZE: {
            dispatch(settingsActions.setDefaultFontSize(value))
            break
          }
          case SETTINGS.FONT_WEIGHT: {
            dispatch(settingsActions.setFontWeight(value))
            break
          }
        }
      }}
      onClickClose={() => {
        dispatch(actions.setOpenSettingsModal(false))
      }}
    />
  )
}

export default SettingsModal
