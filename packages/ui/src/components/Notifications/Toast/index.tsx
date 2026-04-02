import DefaultButton from '@components/Buttons/DefaultButton'
import ProgressBar from '@components/ProgressBar'
import Show from '@components/Show'
import { Typography } from '@components/Typography'
import { NOTIFICATION_TYPE } from '@interfaces/notifications/enums'
import { IToast } from '@interfaces/notifications/interfaces'
import { FC, useEffect, useMemo, useState } from 'react'
import { FiAlertTriangle } from 'react-icons/fi'
import { GoInfo } from 'react-icons/go'
import { IoIosCheckmarkCircleOutline, IoIosClose } from 'react-icons/io'

interface IProps {
  toast: IToast
  index: number
  total: number
  hovering: boolean
  onStartRemoving: (id: number) => void
  dismiss: (id: number) => void
}

const Toast: FC<IProps> = ({ onStartRemoving, toast, dismiss, hovering, index, total }) => {
  const [removing, setRemoving] = useState(false)
  const [mounted, setMounted] = useState(false)

  let timer: ReturnType<typeof setTimeout> | undefined
  let remaining = toast.duration
  let startTime = Date.now()

  useEffect(() => {
    setTimeout(() => {
      setMounted(true)
    }, 20)
  }, [])

  const removeToast = (): void => {
    setRemoving(true)
    onStartRemoving(toast.id)
    setTimeout(() => dismiss(toast.id), 340)
  }

  useEffect(() => {
    if (hovering) {
      clearTimeout(timer)
      remaining -= Date.now() - startTime
      return
    }

    timer = setTimeout(removeToast, remaining)
    startTime = Date.now()

    return () => {
      clearTimeout(timer)
    }
  }, [hovering])

  const multiplier = useMemo(() => {
    if (toast.description) {
      return 75
    }
    return 65
  }, [toast.description])

  const outerTransform = useMemo(() => {
    const scale = hovering ? 1 : 1 - index * 0.042
    const translateY = hovering ? index * multiplier : index * 10

    if (removing) {
      return `translateY(calc(-100% - 32px)) scale(${scale})`
    }
    if (!mounted) {
      return `translateY(calc(-100% - 12px)) scale(${scale}) translateX(0px)`
    }
    return `translateY(${translateY}px) scale(${scale}) translateX(${0}px)`
  }, [hovering, index, multiplier, removing, mounted])

  const outerOpacity = useMemo(() => {
    if (removing) return '0'
    if (!mounted) return '0'
    if (hovering && index <= 5) return '1'
    return String(index >= 4 ? 0 : 1 - index * 0.13)
  }, [hovering, index, removing, mounted])

  const outerTransition = useMemo(() => {
    if (removing) {
      return 'transform 0.34s cubic-bezier(0.4, 0, 1, 1), opacity 0.26s ease'
    }
    return 'transform 0.42s cubic-bezier(0.25, 1.0, 0.5, 1), opacity 0.34s ease'
  }, [removing])

  const progressBarColor = useMemo(() => {
    return {
      [NOTIFICATION_TYPE.SUCCESS]: '#58D39B',
      [NOTIFICATION_TYPE.DEFAULT]: '#4DA3FF',
      [NOTIFICATION_TYPE.WARNING]: '#FFAE57',
      [NOTIFICATION_TYPE.INFO]: '#4DA3FF',
      [NOTIFICATION_TYPE.ERROR]: '#E45C5C',
    }[toast.type]
  }, [toast.type])

  const icon = useMemo(() => {
    return {
      [NOTIFICATION_TYPE.SUCCESS]: <IoIosCheckmarkCircleOutline color={progressBarColor} />,
      [NOTIFICATION_TYPE.DEFAULT]: <GoInfo color={progressBarColor} />,
      [NOTIFICATION_TYPE.WARNING]: <FiAlertTriangle color={progressBarColor} />,
      [NOTIFICATION_TYPE.INFO]: <GoInfo color={progressBarColor} />,
      [NOTIFICATION_TYPE.ERROR]: <FiAlertTriangle color={progressBarColor} />,
    }
  }, [progressBarColor])

  return (
    <div
      className="absolute top-24 left-0 w-[400px]"
      style={{
        transform: outerTransform,
        opacity: outerOpacity,
        transition: outerTransition,
        zIndex: String(total - index),
        willChange: 'transform, opacity',
      }}>
      <div className="relative bg-surface-drawer border border-notification-neutral-border rounded-14 px-14 pt-14 pb-16 overflow-hidden backdrop-blur-md select-none">
        <div className="flex flex-row w-full justify-start gap-12">
          <div className="flex items-center justify-center">{icon[toast.type]}</div>
          <div className="flex flex-row w-full justify-between">
            <div className="flex flex-col items-start justify-center gap-12">
              <Typography color="white" text="caption" class="text-left">
                {toast.message}
              </Typography>
              <Show when={typeof toast.description !== 'undefined'}>
                <Typography color="white" text="caption" class="text-left">
                  {toast.description}
                </Typography>
              </Show>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <DefaultButton onClick={removeToast}>
              <IoIosClose className="w-24 h-24 text-text-primary" />
            </DefaultButton>
          </div>
        </div>
        <ProgressBar duration={toast.duration} color={progressBarColor} paused={hovering} />
      </div>
    </div>
  )
}

export default Toast
