import SegmentedButton from '@components/Buttons/SegmentedButton'
import Match from '@components/Match'
import Modal from '@components/Modal'
import Switch from '@components/Switch'
import { FC, memo, useState } from 'react'
import FontSettings from './FontSettings'
import LayoutSettings from './LayoutSettings'
import { SETTINGS } from '@interfaces/settings/enums'

export interface IProps {
  onClickClose: () => void
  onClick: (action: SETTINGS, value: number) => void
  defaultFontSize: number
  fontWeight: number
  isOpen: boolean
}

enum Options {
  FONT = 'font',
  LAYOUT = 'layout',
}

const Settings: FC<IProps> = ({ isOpen, onClickClose, defaultFontSize, fontWeight, onClick }) => {
  const [option, SetOption] = useState<Options>(Options.FONT)

  return (
    <Modal isFooter={false} onClickClose={onClickClose} isOpen={isOpen} centered>
      <SegmentedButton<Options>
        value={option}
        options={Object.values(Options)}
        onClickOption={(value) => {
          SetOption(value)
        }}
      />
      <div className="h-[400px] overflow-y-auto">
        <Switch>
          <Match when={option === Options.FONT}>
            <FontSettings
              onClick={onClick}
              defaultFontSize={defaultFontSize}
              fontWeight={fontWeight}
            />
          </Match>
          <Match when={option === Options.LAYOUT}>
            <LayoutSettings />
          </Match>
        </Switch>
      </div>
    </Modal>
  )
}

export default memo(Settings)
