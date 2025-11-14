import Show from '@components/Show'
import { Typography } from '@components/Typography'
import { IToc } from '@interfaces/book/interfaces'
import { FC, memo, useMemo } from 'react'

export interface IProps {
  item: IToc
  level: number
}

const Toc: FC<IProps> = ({ item, level }) => {
  const hasSubitems = useMemo(
    () => Array.isArray(item.subitems) && item.subitems.length > 0,
    [item.subitems]
  )

  return (
    <div className="pl-12">
      <Typography>{item.label}</Typography>
      <Show when={hasSubitems}>
        <div className="pl-12">
          {item.subitems.map((sub, index) => (
            <Toc key={index} item={sub} level={level + 1} />
          ))}
        </div>
      </Show>
    </div>
  )
}

export default memo(Toc)
