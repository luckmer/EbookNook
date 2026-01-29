import Match from '@components/Match'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import Switch from '@components/Switch'
import TypographyPreview from '@components/TypographyPreview'
import { useWindowSize } from '@hooks/useWindowSize'
import { OPTIONS, SETTINGS } from '@interfaces/settings/enums'
import { ISettingsState } from '@interfaces/settings/interfaces'
import clsx from 'clsx'
import { FC, memo, useEffect, useMemo, useState } from 'react'
import FontSettings from './FontSettings'
import LayoutSettings from './LayoutSettings'
import SettingsSidePanel from './SettingsSidePanel'

export interface IProps {
  onClickClose: () => void
  onClick: (action: SETTINGS, value: number) => void
  settings: ISettingsState
  isOpen: boolean
}

const Settings: FC<IProps> = ({ isOpen, onClickClose, settings, onClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [option, setOption] = useState<OPTIONS>(OPTIONS.FONT)
  const { width } = useWindowSize()

  const isMobile = useMemo(() => width <= 700, [width])

  useEffect(() => {
    if (isOpen) {
      setIsMobileMenuOpen(false)
      setOption(OPTIONS.FONT)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isMobile) setIsMobileMenuOpen(false)
  }, [isMobile])

  const previewStyles = useMemo(() => {
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
      isFullscreen={isMobile}
      width={isMobile ? '100%' : 900}
      height={isMobile ? '100%' : undefined}
      isFooter={false}
      onClickClose={onClickClose}
      isOpen={isOpen}
      centered
      closable={false}>
      <div className="flex flex-col overflow-hidden h-full relative">
        <ModalHeader
          onClickClose={onClickClose}
          label="Settings"
          onClickOpen={isMobile ? () => setIsMobileMenuOpen(!isMobileMenuOpen) : undefined}
          open={isMobileMenuOpen}
        />
        <div className="flex flex-row h-full overflow-hidden">
          <aside
            className={clsx(
              'border-r border-border-modal bg-surface-400 py-16 transition-all duration-200 z-10',
              isMobile ? 'absolute h-full w-full' : 'min-w-[220px] static',
              isMobile && (isMobileMenuOpen ? 'left-0' : '-left-full'),
            )}>
            <SettingsSidePanel
              option={option}
              onClickOption={(newOption: OPTIONS) => {
                setOption(newOption)
                setIsMobileMenuOpen(false)
              }}
            />
          </aside>
          <main
            className={clsx('py-24  overflow-y-auto w-full', isMobile ? 'h-full' : 'h-[600px] ')}>
            <Switch>
              <Match when={option === OPTIONS.FONT}>
                <FontSettings
                  onClickRestart={() => onClick(SETTINGS.RESET_FONT_SETTINGS, 0)}
                  onClick={onClick}
                  defaultFontSize={settings.defaultFontSize}
                  fontWeight={settings.fontWeight}>
                  <TypographyPreview styles={previewStyles} />
                </FontSettings>
              </Match>
              <Match when={option === OPTIONS.LAYOUT}>
                <LayoutSettings
                  onClickRestart={() => onClick(SETTINGS.RESET_LAYOUT_SETTINGS, 0)}
                  onClick={onClick}
                  wordSpacing={settings.wordSpacing}
                  letterSpacing={settings.letterSpacing}
                  textIndent={settings.textIndent}
                  lineHeight={settings.lineHeight}
                  paragraphMargin={settings.paragraphMargin}>
                  <TypographyPreview styles={previewStyles} />
                </LayoutSettings>
              </Match>
            </Switch>
          </main>
        </div>
      </div>
    </Modal>
  )
}

export default memo(Settings)
