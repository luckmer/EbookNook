import { FC } from 'react'
import clsx from 'clsx'
import DefaultButton from '@components/Buttons/DefaultButton'
import { Typography } from '@components/Typography'
import { LuLayoutDashboard } from 'react-icons/lu'
import { RiFontSize } from 'react-icons/ri'
import { OPTIONS } from '@interfaces/settings/enums'

export interface IProps {
  onClickOption: (option: OPTIONS) => void
  option: OPTIONS
}

const SIDE_PANEL_ITEMS = [
  { id: OPTIONS.FONT, label: 'Font', Icon: RiFontSize },
  { id: OPTIONS.LAYOUT, label: 'Layout', Icon: LuLayoutDashboard },
]

const SettingsSidePanel: FC<IProps> = ({ option, onClickOption }) => {
  return SIDE_PANEL_ITEMS.map(({ id, label, Icon }) => {
    const isActive = option === id
    return (
      <DefaultButton
        key={id}
        onClick={() => onClickOption(id)}
        className={clsx(
          'flex w-full items-center gap-4 border-l-2 px-[20px] py-12 hover:bg-button-secondary-background',
          isActive ? 'border-accent-blue bg-button-secondary-background' : 'border-transparent',
        )}>
        <Icon className={clsx('h-[18px] w-[18px]', !isActive && 'text-text-secondary')} />
        <Typography color={isActive ? 'white' : 'secondary'}>{label}</Typography>
      </DefaultButton>
    )
  })
}

export default SettingsSidePanel
