import Drawer from '@components/Drawer'
import Toc from '@components/Toc'
import { IToc } from '@interfaces/book/interfaces'
import { FC } from 'react'

export interface IProps {
  isOpen: boolean
  onClickClose: () => void
  icon: string
  title: string
  author: string
  toc: IToc[]
}

const ChaptersDrawer: FC<IProps> = ({ isOpen, onClickClose, toc }) => {
  return (
    <Drawer onClickClose={onClickClose} isOpen={isOpen} placement="left">
      {toc.map((el, index) => (
        <Toc key={index} item={el} level={0} />
      ))}
    </Drawer>
  )
}

export default ChaptersDrawer
