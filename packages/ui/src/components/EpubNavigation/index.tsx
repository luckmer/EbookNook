import DefaultButton from '@components/Buttons/DefaultButton'
import clsx from 'clsx'
import { FC, memo, ReactNode } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import { TbPlayerTrackNextFilled, TbPlayerTrackPrevFilled } from 'react-icons/tb'
export interface IProps {
  children: ReactNode
  onClickNextPage: () => void
  onClickPrevPage: () => void
  onClickNextChapter: () => void
  onClickPrevChapter: () => void
  hideContent: boolean
}

const EpubNavigation: FC<IProps> = ({
  children,
  onClickNextChapter,
  onClickNextPage,
  onClickPrevChapter,
  onClickPrevPage,
  hideContent,
}) => {
  return (
    <div className="w-full h-full flex flex-col">
      {children}
      <div
        className={clsx(
          'flex flex-row justify-between items-center w-full transition-opacity duration-300 px-12 py-12 z-10 bg-deep',
          hideContent ? 'opacity-0' : 'opacity-100',
        )}>
        <div className="flex flex-row gap-6">
          <DefaultButton
            onClick={onClickPrevChapter}
            className="transition-colors hover:bg-button-primary-hover hover:text-text-primary text-text-secondary duration-300 rounded-4 px-6 py-6">
            <TbPlayerTrackPrevFilled className="w-18 h-18 transition-colors duration-200" />
          </DefaultButton>
          <DefaultButton
            onClick={onClickPrevPage}
            className="transition-colors hover:bg-button-primary-hover hover:text-text-primary text-text-secondary duration-300 rounded-4 px-6 py-6">
            <FaChevronLeft className="w-18 h-18 transition-colors duration-200" />
          </DefaultButton>
        </div>
        <div className="flex flex-row gap-6">
          <DefaultButton
            onClick={onClickNextPage}
            className="transition-colors hover:bg-button-primary-hover hover:text-text-primary text-text-secondary duration-300 rounded-4 px-6 py-6">
            <FaChevronRight className="w-18 h-18 transition-colors duration-200" />
          </DefaultButton>
          <DefaultButton
            onClick={onClickNextChapter}
            className="transition-colors hover:bg-button-primary-hover hover:text-text-primary text-text-secondary duration-300 rounded-4 px-6 py-6">
            <TbPlayerTrackNextFilled className="w-18 h-18 transition-colors duration-200" />
          </DefaultButton>
        </div>
      </div>
    </div>
  )
}

export default memo(EpubNavigation)
