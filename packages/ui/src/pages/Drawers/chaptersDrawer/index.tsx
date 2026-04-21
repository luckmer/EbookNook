import DefaultButton from '@components/Buttons/DefaultButton'
import Drawer from '@components/Drawer'
import Show from '@components/Show'
import Toc from '@components/Toc'
import { Typography } from '@components/Typography'
import { useWindowSize } from '@hooks/useWindowSize'
import { Skeleton } from 'antd'
import { FC, useEffect, useMemo, useState } from 'react'
import { IoLibraryOutline } from 'react-icons/io5'

export interface ITocItem {
  label: string
  href?: string
  id?: string
  subitems?: ITocItem[]
}

export interface IProps {
  onClick: (href: string) => void
  onClickClose: () => void
  onClickBack: () => void
  isOpen: boolean
  icon?: string
  title: string
  author: string
  toc: ITocItem[]
  isLoader: boolean
  activeToc: ITocItem
}

const ChaptersDrawer: FC<IProps> = ({
  isOpen,
  onClickClose,
  onClickBack,
  onClick,
  toc,
  icon,
  title,
  author,
  isLoader,
  activeToc,
}) => {
  const [hasLoadError, setHasLoadError] = useState(false)
  const [cache, setCache] = useState<string | undefined>(undefined)
  const { width } = useWindowSize()

  const isMobile = useMemo(() => width <= 700, [width])

  useEffect(() => {
    if (icon === cache) return
    setHasLoadError(false)
    setCache(icon)
  }, [icon])

  return (
    <Drawer
      onClickClose={onClickClose}
      isOpen={isOpen}
      placement={isMobile ? 'bottom' : 'left'}
      height={isMobile ? '80%' : '100%'}>
      <div className="pb-12 border-b border-border-modal flex flex-col gap-24">
        <div>
          <DefaultButton
            onClick={onClickBack}
            className="transition-colors hover:bg-button-primary-hover hover:text-text-primary text-text-secondary duration-300 rounded-4 px-6 py-6">
            <IoLibraryOutline className="w-24 h-24 transition-colors duration-200" />
          </DefaultButton>
        </div>
        <Show when={!isLoader} fallback={<Skeleton active />}>
          <div className="flex flex-row gap-12">
            <Show when={!hasLoadError}>
              <img
                className="w-48 h-[64px] object-cover rounded-4 pointer-events-none select-none"
                src={icon}
                onError={(e) => {
                  e.stopPropagation()
                  setHasLoadError(true)
                }}
              />
            </Show>
            <div className="flex flex-col gap-6">
              <Typography>{title}</Typography>
              <Typography text="small" color="secondary">
                {author}
              </Typography>
            </div>
          </div>
        </Show>
      </div>
      <div className="py-12">
        <Show when={!isLoader} fallback={<Skeleton active />}>
          {toc.map((el, index) => (
            <Toc key={index} item={el} level={0} onClick={onClick} activeToc={activeToc} />
          ))}
        </Show>
      </div>
    </Drawer>
  )
}

export default ChaptersDrawer
