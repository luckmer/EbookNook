import { Breakpoint, Modal } from 'antd'
import clsx from 'clsx'
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
  isFullscreen?: boolean
}

const ModalRoot: FC<IProps> = ({
  isFullscreen,
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
      open={isOpen}
      onCancel={onClickClose}
      footer={isFooter ? undefined : null}
      closable={closable ?? true}
      centered={centered && !isFullscreen}
      width={isFullscreen ? '100vw' : (width ?? 700)}
      rootClassName={clsx(isFullscreen && 'fullscreen-modal-wrapper')}
      styles={{
        content: isFullscreen
          ? {
              height: '100vh',
              borderRadius: 0,
              padding: 0,
            }
          : {},
        body: isFullscreen
          ? {
              flex: 1,
              overflow: 'auto',
            }
          : { height },
      }}>
      {children}
    </Modal>
  )
}

export default memo(ModalRoot)
