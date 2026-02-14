import Drawer from '@components/Drawer'
import { FC } from 'react'

export interface IProps {
  onClickClose: () => void
  isOpen: boolean
}

const NotebookDrawer: FC<IProps> = ({ onClickClose, isOpen }) => {
  return (
    <Drawer onClickClose={onClickClose} isOpen={isOpen} placement="right">
      <div className="pb-12 border-b border-border-modal flex flex-col gap-24">
        <div></div>
        <div className="flex flex-row gap-12">
          <div className="flex flex-col gap-6"></div>
        </div>
      </div>
      <div className="py-12"></div>
    </Drawer>
  )
}

export default NotebookDrawer
