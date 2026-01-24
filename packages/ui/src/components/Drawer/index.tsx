import { Drawer, DrawerProps } from 'antd'
import { FC, memo } from 'react'

export interface IProps {
  placement: DrawerProps['placement']
  onClickClose: () => void
  isOpen: boolean
  children: React.ReactNode
}

const DrawerRoot: FC<IProps> = ({ placement, isOpen, children, onClickClose }) => {
  return (
    <Drawer
      placement={placement}
      closable={false}
      onClose={onClickClose}
      open={isOpen}
      height={'100%'}
      key={placement}>
      {children}
    </Drawer>
  )
}

export default memo(DrawerRoot)
