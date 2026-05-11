import Show from '@components/Show'
import Toc from '@components/Toc'
import { Skeleton } from 'antd'
import { FC, memo } from 'react'

export interface ITocItem {
  label: string
  href?: string
  id?: string
  subitems?: ITocItem[]
}

export interface IProps {
  onClick: (href: string) => void
  toc: ITocItem[]
  activeToc: ITocItem
  isLoader: boolean
}

const ContentsLayout: FC<IProps> = ({ toc, activeToc, isLoader, onClick }) => {
  return (
    <div className="pr-24">
      <Show when={!isLoader} fallback={<Skeleton active />}>
        {toc.map((el, index) => (
          <Toc key={index} item={el} level={0} onClick={onClick} activeToc={activeToc} />
        ))}
      </Show>
    </div>
  )
}

export default memo(ContentsLayout)
