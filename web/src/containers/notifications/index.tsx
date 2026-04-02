import Notifications from '@components/Notifications'
import { actions } from '@store/reducers/notifications'
import { notificationsSelector } from '@store/selectors/notifications'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
export const NotificationsRoot = () => {
  const notifications = useSelector(notificationsSelector.notifications)
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set())
  const [hovering, setHovering] = useState(false)

  const dispatch = useDispatch()

  const onStartRemoving = (id: number): void => {
    setRemovingIds((prev) => new Set([...prev, id]))
    setTimeout(() => {
      setRemovingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 400)
  }

  const effectiveIndex = (id: number): number => {
    const removing = removingIds
    let idx = 0
    for (const t of notifications) {
      if (t.id === id) return idx
      if (!removing.has(t.id)) idx++
    }
    return idx
  }

  return (
    <Notifications
      notifications={notifications}
      hovering={hovering}
      onMouseEnter={() => {
        setHovering(true)
      }}
      effectiveIndex={effectiveIndex}
      onStartRemoving={onStartRemoving}
      onMouseLeave={() => {
        setHovering(false)
      }}
      onClickDismiss={(id) => {
        dispatch(actions.dismissNotification(id))
      }}
    />
  )
}
