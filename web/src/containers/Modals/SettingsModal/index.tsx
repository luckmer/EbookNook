import { SETTINGS } from '@interfaces/settings/enums'
import Settings from '@pages/Settings'
import { actions as settingsActions } from '@store/reducers/settings'
import { actions } from '@store/reducers/ui'
import { settingsConfig } from '@store/selectors/settings'
import { uiSelector } from '@store/selectors/ui'
import { useDispatch, useSelector } from 'react-redux'

const SettingsModal = () => {
  const openSettingsModal = useSelector(uiSelector.openSettingsModal)
  const settings = useSelector(settingsConfig)
  const dispatch = useDispatch()

  return (
    <Settings
      isOpen={openSettingsModal}
      settings={settings}
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
          case SETTINGS.WORD_SPACING: {
            dispatch(settingsActions.setWordSpacing(value))
            break
          }
          case SETTINGS.LETTER_SPACING: {
            dispatch(settingsActions.setLetterSpacing(value))
            break
          }
          case SETTINGS.TEXT_INDENT: {
            dispatch(settingsActions.setTextIndent(value))
            break
          }
          case SETTINGS.LINE_HEIGHT: {
            dispatch(settingsActions.setLineHeight(value))
            break
          }
          case SETTINGS.RESET_FONT_SETTINGS: {
            dispatch(settingsActions.setResetFontSettings())
            break
          }
          case SETTINGS.RESET_LAYOUT_SETTINGS: {
            dispatch(settingsActions.setResetLayoutSettings())
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
