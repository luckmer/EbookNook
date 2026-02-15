import { type Toc } from '@bindings/epub'
import DefaultButton from '@components/Buttons/DefaultButton'
import Show from '@components/Show'
import { Typography } from '@components/Typography'
import clsx from 'clsx'
import { FC, memo, useMemo, useState } from 'react'
import { IoIosArrowUp } from 'react-icons/io'

export interface IProps {
  onClick: (href: string) => void
  item: Toc
  level: number
}

const Toc: FC<IProps> = ({ item, level, onClick }) => {
  const [open, setOpen] = useState(false)

  const hasSubitems = useMemo(
    () => Array.isArray(item.subitems) && item.subitems.length > 0,
    [item.subitems],
  )

  return (
    <div className={clsx('flex flex-col', hasSubitems && 'my-4')}>
      <DefaultButton
        className={clsx(
          'pl-6 group h-[35px] w-full flex items-center ',
          'hover:bg-hover-greyBlue-200 transition-colors duration-300 opacity-80 hover:bg-button-primary-hover rounded-6',
        )}
        onClick={() => {
          onClick(item.href)
          if (open && hasSubitems) return
          setOpen(true)
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
                  open ? 'rotate-x-180 opacity-100' : '',
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
            open ? 'block' : 'hidden',
          )}>
          <div className="pl-12 transition-all duration-300 ease-in-out">
            {item.subitems.map((sub, index) => (
              <Toc key={index} item={sub} level={level++} onClick={onClick} />
            ))}
          </div>
        </div>
      </Show>
    </div>
  )
}

export default memo(Toc)
