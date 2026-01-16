import DefaultButton from '@components/Buttons/DefaultButton'
import Drawer from '@components/Drawer'
import Toc from '@components/Toc'
import { Typography } from '@components/Typography'
import { FC } from 'react'
import { IoLibraryOutline } from 'react-icons/io5'
import { type Toc as IToc } from '@bindings/epub'
export interface IProps {
  onClick: (href: string) => void
  onClickClose: () => void
  onClickBack: () => void
  isOpen: boolean
  icon?: string
  title: string
  author: string
  toc: IToc[]
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
}) => {
  return (
    <Drawer onClickClose={onClickClose} isOpen={isOpen} placement="left">
      <div className="pb-12 border-b border-border-modal flex flex-col gap-24">
        <div>
          <DefaultButton
            onClick={onClickBack}
            className="transition-colors hover:bg-button-primary-hover hover:text-text-primary text-text-secondary duration-300 rounded-4 px-6 py-6">
            <IoLibraryOutline className="w-24 h-24 transition-colors duration-200" />
          </DefaultButton>
        </div>
        <div className="flex flex-row gap-12">
          <img
            src={icon}
            className="w-48 h-[64px] object-cover rounded-4 pointer-events-none select-none"
          />
          <div className="flex flex-col gap-6">
            <Typography>{title}</Typography>
            <Typography text="small" color="secondary">
              {author}
            </Typography>
          </div>
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
