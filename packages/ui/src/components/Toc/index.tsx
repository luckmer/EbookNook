import DefaultButton from '@components/Buttons/DefaultButton'
import Show from '@components/Show'
import { Typography } from '@components/Typography'
import clsx from 'clsx'
import { FC, memo, useEffect, useMemo, useState } from 'react'
import { IoIosArrowUp } from 'react-icons/io'

export interface ITocItem {
  label: string
  href?: string
  id?: string
  subitems?: ITocItem[]
}

export interface IProps {
  onClick: (href: string) => void
  activeToc: ITocItem
  item: ITocItem
  level: number
}

export interface ITocItem {
  label: string
  href?: string
  id?: string
  subitems?: ITocItem[]
}

export interface IProps {
  onClick: (href: string) => void
  activeToc: ITocItem
  item: ITocItem
  level: number
}

const Toc: FC<IProps> = ({ item, level, activeToc, onClick }) => {
  const [open, setOpen] = useState(false)

  const hasSubitems = useMemo(
    () => Array.isArray(item.subitems) && item.subitems.length > 0,
    [item.subitems],
  )

  const containsActiveItem = (currentItem: ITocItem, target: ITocItem): boolean => {
    if (!currentItem.subitems) return false

    return currentItem.subitems.some((sub) => {
      const isMatch = (sub.id && sub.id === target?.id) || (sub.href && sub.href === target?.href)
      if (isMatch) return true

      return containsActiveItem(sub, target)
    })
  }

  useEffect(() => {
    if (!activeToc) return

    const shouldBeOpen = containsActiveItem(item, activeToc)

    if (shouldBeOpen) {
      setOpen(true)
    }
  }, [activeToc, item])

  const isActive = useMemo(() => {
    if (activeToc?.id === '-1' || !activeToc) {
      return false
    }

    return activeToc?.href === item?.href || (item?.id && item?.id === activeToc?.id)
  }, [activeToc, item])

  return (
    <div className={clsx('flex flex-col', hasSubitems && 'my-4')}>
      <DefaultButton
        className={clsx(
          'pl-6 group h-[35px] w-full flex items-center ',
          isActive && 'bg-button-primary-hover',
          'hover:bg-hover-greyBlue-200 transition-colors duration-300 opacity-80 hover:bg-button-primary-hover rounded-6',
        )}
        onClick={() => {
          onClick(item?.href ?? item?.id ?? '')
          if (hasSubitems) setOpen(true)
        }}>
        <div className="flex flex-row gap-12 items-center w-full">
          <Show when={hasSubitems}>
            <div
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setOpen((prev) => !prev)
              }}>
              <IoIosArrowUp
                className={clsx(
                  'transition-all duration-300 ease-in-out opacity-20 group-hover:opacity-100 min-w-[14px] min-h-[14px] max-w-[14px] max-h-[14px]',
                  open ? 'rotate-180 opacity-100' : 'rotate-90',
                )}
              />
            </div>
          </Show>
          <Typography nowrap left ellipsis>
            {item.label}
          </Typography>
        </div>
      </DefaultButton>

      <Show when={hasSubitems}>
        <div
          className={clsx(
            'overflow-hidden transition-all duration-300 ease-in-out',
            open ? 'max-h-fit opacity-100' : 'max-h-0 opacity-0 pointer-events-none',
          )}>
          <div className="pl-12">
            {(item.subitems ?? []).map((sub, index) => (
              <Toc
                key={sub.id ?? index}
                item={sub}
                level={level + 1}
                onClick={onClick}
                activeToc={activeToc}
              />
            ))}
          </div>
        </div>
      </Show>
    </div>
  )
}

export default memo(Toc)
