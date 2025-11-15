import Drawer from '@components/Drawer'
import Toc from '@components/Toc'
import { Typography } from '@components/Typography'
import { IToc } from '@interfaces/book/interfaces'
import { FC } from 'react'

export interface IProps {
  onClick: (href: string) => void
  onClickClose: () => void
  isOpen: boolean
  icon?: string
  title: string
  author: string
  toc: IToc[]
}

const ChaptersDrawer: FC<IProps> = ({
  isOpen,
  onClickClose,
  onClick,
  toc,
  icon,
  title,
  author,
}) => {
  return (
    <Drawer onClickClose={onClickClose} isOpen={isOpen} placement="left">
      <div className="pb-12 border-b border-black-200 flex flex-row gap-12">
        <img
          src={icon}
          className="w-48 h-[64px] object-cover rounded-4 pointer-events-none select-none"
        />
        <div className="flex flex-col gap-6">
          <Typography>{title}</Typography>
          <Typography text="small" color="lightWhite">
            {author}
          </Typography>
        </div>
      </div>
      <div className="py-12">
        {toc.map((el, index) => (
          <Toc key={index} item={el} level={0} onClick={onClick} />
        ))}
      </div>
    </Drawer>
  )
}

export default ChaptersDrawer
