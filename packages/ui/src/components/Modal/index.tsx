import { Modal } from 'antd'
import { FC, memo } from 'react'

export interface IProps {
  children: React.ReactNode
  onClickClose: () => void
  isFooter: boolean
  isOpen: boolean
  centered: boolean
  width?: number
}

const ModalRoot: FC<IProps> = ({ isFooter, isOpen, onClickClose, children, centered, width }) => {
  return (
    <Modal
      footer={isFooter}
      open={isOpen}
      onCancel={onClickClose}
      centered={centered}
      width={width ?? 700}>
      {children}
    </Modal>
  )
}

export default memo(ModalRoot)
