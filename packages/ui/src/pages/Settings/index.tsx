import SegmentedButton from '@components/Buttons/SegmentedButton'
import Match from '@components/Match'
import Modal from '@components/Modal'
import Switch from '@components/Switch'
import { Typography } from '@components/Typography'
import { SETTINGS } from '@interfaces/settings/enums'
import { ISettingsState } from '@interfaces/settings/interfaces'
import { Dropdown } from 'antd'
import { FC, memo, useMemo, useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import FontSettings from './FontSettings'
import LayoutSettings from './LayoutSettings'

export interface IProps {
  onClickClose: () => void
  onClick: (action: SETTINGS, value: number) => void
  settings: ISettingsState
  isOpen: boolean
}

enum Options {
  FONT = 'font',
  LAYOUT = 'layout',
}

const Settings: FC<IProps> = ({ isOpen, onClickClose, settings, onClick }) => {
  const [option, SetOption] = useState<Options>(Options.FONT)

  const items = useMemo(() => {
    let labelText: string

    switch (option) {
      case Options.FONT:
        labelText = 'Reset Font'
        break
      case Options.LAYOUT:
        labelText = 'Reset Layout'
        break
    }

    return [
      {
        key: '1',
        label: (
          <div className="py-6">
            <Typography>{labelText}</Typography>
          </div>
        ),
      },
    ]
  }, [option])

  return (
    <Modal isFooter={false} onClickClose={onClickClose} isOpen={isOpen} centered>
      <div className="w-[calc(100%-44px)] flex items-center justify-between pt-4">
        <SegmentedButton<Options>
          value={option}
          options={Object.values(Options)}
          onClickOption={(value) => {
            SetOption(value)
          }}
        />
        <Dropdown
          menu={{
            items,
            onClick: () => {
              switch (option) {
                case Options.FONT: {
                  onClick(SETTINGS.RESET_FONT_SETTINGS, 0)
                  break
                }
                case Options.LAYOUT: {
                  onClick(SETTINGS.RESET_LAYOUT_SETTINGS, 0)
                  break
                }
              }
            },
          }}
          placement="bottomRight">
          <div className="p-6 rounded-24 hover:bg-button-primary-hover cursor-pointer">
            <BsThreeDotsVertical />
          </div>
        </Dropdown>
      </div>

      <div className="h-[400px] overflow-y-auto">
        <Switch>
          <Match when={option === Options.FONT}>
            <FontSettings
              onClick={onClick}
              defaultFontSize={settings.defaultFontSize}
              fontWeight={settings.fontWeight}
            />
          </Match>
          <Match when={option === Options.LAYOUT}>
            <LayoutSettings
              onClick={onClick}
              wordSpacing={settings.wordSpacing}
              letterSpacing={settings.letterSpacing}
              textIndent={settings.textIndent}
              lineHeight={settings.lineHeight}
            />
          </Match>
        </Switch>
      </div>
    </Modal>
  )
}

export default memo(Settings)
