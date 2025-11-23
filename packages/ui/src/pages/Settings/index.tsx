import SegmentedButton from '@components/Buttons/SegmentedButton'
import Match from '@components/Match'
import Modal from '@components/Modal'
import Switch from '@components/Switch'
import { FC, memo, useState } from 'react'
import FontSettings from './FontSettings'
import LayoutSettings from './LayoutSettings'

export interface IProps {
  onClickClose: () => void
  isOpen: boolean
}

enum Options {
  FONT = 'font',
  LAYOUT = 'layout',
}

const Settings: FC<IProps> = ({ isOpen, onClickClose }) => {
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
      <Switch>
        <Match when={option === Options.FONT}>
          <FontSettings />
        </Match>
        <Match when={option === Options.LAYOUT}>
          <LayoutSettings />
        </Match>
      </Switch>
    </Modal>
  )
}

export default memo(Settings)
