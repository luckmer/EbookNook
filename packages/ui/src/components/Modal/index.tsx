import { Modal } from 'antd'
import { FC, memo } from 'react'

export interface IProps {
  children: React.ReactNode
  onClickClose: () => void
  isFooter: boolean
  isOpen: boolean
  centered: boolean
}

const ModalRoot: FC<IProps> = ({ isFooter, isOpen, onClickClose, children, centered }) => {
  return (
    <Modal footer={isFooter} open={isOpen} onCancel={onClickClose} centered={centered} width={700}>
      {children}
    </Modal>
  )
}

export default memo(ModalRoot)
