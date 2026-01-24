import { Breakpoint, Modal } from 'antd'
import { FC, memo } from 'react'

export interface IProps {
  children: React.ReactNode
  onClickClose: () => void
  isFooter: boolean
  isOpen: boolean
  centered: boolean
  width?: string | number | Partial<Record<Breakpoint, string | number>>
  height?: string | number
  closable?: boolean
}

const ModalRoot: FC<IProps> = ({
  isFooter,
  isOpen,
  onClickClose,
  children,
  centered,
  closable,
  width,
  height,
}) => {
  return (
    <Modal
      footer={isFooter}
      open={isOpen}
      closable={closable ?? true}
      onCancel={onClickClose}
      centered={centered}
      height={height}
      width={width ?? 700}>
      {children}
    </Modal>
  )
}

export default memo(ModalRoot)
