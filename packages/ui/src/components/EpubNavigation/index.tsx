import DefaultButton from '@components/Buttons/DefaultButton'
import { Typography } from '@components/Typography'
import { FC, memo, ReactNode } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import { TbPlayerTrackNextFilled, TbPlayerTrackPrevFilled } from 'react-icons/tb'
export interface IProps {
  children: ReactNode
  onClickNextPage: () => void
  onClickPrevPage: () => void
  onClickNextChapter: () => void
  onClickPrevChapter: () => void
  currentPage: number
  totalPage: number
}

const EpubNavigation: FC<IProps> = ({
  children,
  onClickNextChapter,
  onClickNextPage,
  onClickPrevChapter,
  onClickPrevPage,
  currentPage,
  totalPage,
}) => {
  return (
    <div className="w-full h-full flex flex-col">
      {children}
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-row gap-6">
          <DefaultButton
            onClick={onClickPrevChapter}
            className="transition-colors hover:bg-black-300 hover:text-white-100 text-white-200 duration-300 rounded-4 px-6 py-6">
            <TbPlayerTrackPrevFilled className=" fill-white-100 w-18 h-18 group-hover:fill-hover-grey-blue-200 transition-colors duration-200" />
          </DefaultButton>
          <DefaultButton
            onClick={onClickPrevPage}
            className="transition-colors hover:bg-black-300 hover:text-white-100 text-white-200 duration-300 rounded-4 px-6 py-6">
            <FaChevronLeft className=" fill-white-100 w-18 h-18 group-hover:fill-hover-grey-blue-200 transition-colors duration-200" />
          </DefaultButton>
        </div>
        <Typography>
          {currentPage} / {totalPage}
        </Typography>
        <div className="flex flex-row gap-6">
          <DefaultButton
            onClick={onClickNextPage}
            className="transition-colors hover:bg-black-300 hover:text-white-100 text-white-200 duration-300 rounded-4 px-6 py-6">
            <FaChevronRight className=" fill-white-100 w-18 h-18 group-hover:fill-hover-grey-blue-200 transition-colors duration-200" />
          </DefaultButton>
          <DefaultButton
            onClick={onClickNextChapter}
            className="transition-colors hover:bg-black-300 hover:text-white-100 text-white-200 duration-300 rounded-4 px-6 py-6">
            <TbPlayerTrackNextFilled className=" fill-white-100 w-18 h-18 group-hover:fill-hover-grey-blue-200 transition-colors duration-200" />
          </DefaultButton>
        </div>
      </div>
    </div>
  )
}

export default memo(EpubNavigation)
