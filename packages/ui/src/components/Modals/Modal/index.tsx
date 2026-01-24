import { Breakpoint, Modal } from 'antd'
import { FC, memo, useEffect, useRef } from 'react'

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
  let ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const modalElement = document.querySelector('.ant-modal') as HTMLElement
    const antModal = document.querySelector('.ant-modal-content') as HTMLElement

    if (!isFullscreen) {
      if (modalElement) {
        modalElement.style.removeProperty('max-width')
        modalElement.style.removeProperty('margin')
        modalElement.style.removeProperty('height')
      }

      if (antModal) {
        antModal.style.removeProperty('max-height')
        antModal.style.removeProperty('height')
      }
      return
    }

    if (modalElement) {
      modalElement.style.setProperty('max-width', '100vw', 'important')
      modalElement.style.setProperty('margin', '0px', 'important')
      modalElement.style.setProperty('height', '100vh', 'important')
    }

    if (antModal) {
      antModal.style.setProperty('max-height', '100vh', 'important')
      antModal.style.setProperty('height', '100vh', 'important')
    }
  }, [isFullscreen, isOpen])

  return (
    <Modal
      panelRef={ref}
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
