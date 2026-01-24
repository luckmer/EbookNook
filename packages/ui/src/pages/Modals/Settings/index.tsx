import Match from '@components/Match'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import Switch from '@components/Switch'
import { OPTIONS, SETTINGS } from '@interfaces/settings/enums'
import { ISettingsState } from '@interfaces/settings/interfaces'
import { FC, memo, useMemo, useState } from 'react'
import FontSettings from './FontSettings'
import LayoutSettings from './LayoutSettings'
import SettingsSidePanel from './SettingsSidePanel'

export interface IProps {
  onClickClose: () => void
  onClick: (action: SETTINGS, value: number) => void
  settings: ISettingsState
  isOpen: boolean
}

const Settings: FC<IProps> = ({ isOpen = true, onClickClose, settings, onClick }) => {
  const [option, SetOption] = useState<OPTIONS>(OPTIONS.FONT)

  const styles = useMemo(() => {
    return {
      marginBottom: `${settings.paragraphMargin}px`,
      fontSize: `${settings.defaultFontSize}px`,
      fontWeight: settings.fontWeight,
      lineHeight: settings.lineHeight,
      wordSpacing: `${settings.wordSpacing}px`,
      letterSpacing: `${settings.letterSpacing}px`,
      textIndent: `${settings.textIndent}px`,
    }
  }, [settings])

  return (
    <Modal
      width={900}
      isFooter={false}
      onClickClose={onClickClose}
      isOpen={isOpen}
      centered
      closable={false}>
      <div className="flex flex-col">
        <ModalHeader onClickClose={onClickClose} label="Settings" />
        <div className="flex flex-row h-full ">
          <div className="min-w-[220px] border-r border-border-modal bg-surface-400 py-16">
            <SettingsSidePanel option={option} onClickOption={SetOption} />
          </div>
          <div className="py-24 h-[600px] w-full">
            <Switch>
              <Match when={option === OPTIONS.FONT}>
                <FontSettings
                  onClickRestart={() => {
                    onClick(SETTINGS.RESET_FONT_SETTINGS, 0)
                  }}
                  onClick={onClick}
                  defaultFontSize={settings.defaultFontSize}
                  fontWeight={settings.fontWeight}>
                  <div>
                    <p style={styles}>
                      The quick brown fox jumps over the lazy dog. Typography is the art and
                      technique of arranging type to make written language legible, readable, and
                      appealing when displayed.
                    </p>
                    <p style={styles}>
                      The arrangement of type involves selecting typefaces, point sizes, line
                      lengths, line-spacing, and letter-spacing for better readability and visual
                      appeal.
                    </p>
                  </div>
                </FontSettings>
              </Match>
              <Match when={option === OPTIONS.LAYOUT}>
                <LayoutSettings
                  onClickRestart={() => {
                    onClick(SETTINGS.RESET_LAYOUT_SETTINGS, 0)
                  }}
                  onClick={onClick}
                  wordSpacing={settings.wordSpacing}
                  letterSpacing={settings.letterSpacing}
                  textIndent={settings.textIndent}
                  lineHeight={settings.lineHeight}
                  paragraphMargin={settings.paragraphMargin}>
                  <div>
                    <p style={styles}>
                      The quick brown fox jumps over the lazy dog. Typography is the art and
                      technique of arranging type to make written language legible, readable, and
                      appealing when displayed.
                    </p>
                    <p style={styles}>
                      The arrangement of type involves selecting typefaces, point sizes, line
                      lengths, line-spacing, and letter-spacing for better readability and visual
                      appeal.
                    </p>
                  </div>
                </LayoutSettings>
              </Match>
            </Switch>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default memo(Settings)
