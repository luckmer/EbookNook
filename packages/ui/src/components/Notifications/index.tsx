import Toast from '@components/Notifications/Toast'
import { IToast } from '@interfaces/notifications/interfaces'
import clsx from 'clsx'
import { FC, memo } from 'react'

export interface IProps {
  effectiveIndex: (id: number) => number
  onStartRemoving: (id: number) => void
  onClickDismiss: (id: number) => void
  onMouseEnter: () => void
  onMouseLeave: () => void
  notifications: IToast[]
  hovering: boolean
}

const Notifications: FC<IProps> = ({
  hovering,
  notifications,
  onMouseEnter,
  onMouseLeave,
  onClickDismiss,
  effectiveIndex,
  onStartRemoving,
}) => {
  return (
    <div
      data-tauri-drag-region
      onMouseEnter={() => onMouseEnter()}
      onMouseLeave={() => onMouseLeave()}
      className={clsx(
        'fixed top-6 left-1/2 -translate-x-1/2 w-[400px] z-999 transition-[height] duration-380 [cubic-bezier(0.34,1.1,0.64,1)]',
        notifications.length ? 'pointer-events-auto' : 'pointer-events-none',
      )}
      style={{
        height: hovering ? `${Math.min(notifications.length, 5) * 72 + 2}px` : '80px',
        transitionTimingFunction: 'cubic-bezier(0.34, 1.1, 0.64, 1)',
      }}>
      {notifications.map((t) => (
        <Toast
          key={t.id}
          toast={t}
          index={effectiveIndex(t.id)}
          total={notifications.length}
          hovering={hovering}
          onStartRemoving={onStartRemoving}
          dismiss={(id) => {
            onClickDismiss(id)
          }}
        />
      ))}
    </div>
  )
}

export default memo(Notifications)
