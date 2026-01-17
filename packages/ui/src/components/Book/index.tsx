import DefaultButton from '@components/Buttons/DefaultButton'
import { Typography } from '@components/Typography'
import { FC, memo } from 'react'
import { IoIosInformationCircleOutline } from 'react-icons/io'

export interface IProps {
  onClickDetails: () => void
  onClick: () => void
  img?: string
  title: string
}

const Book: FC<IProps> = ({ img, title, onClick, onClickDetails }) => {
  return (
    <div
      className="flex flex-col p-12 w-full gap-12 rounded-6 cursor-pointer transition-colors duration-300 hover:bg-button-primary-hover/40"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }}>
      <img className="rounded-6 h-full object-cover" src={img} />
      <div className="flex flex-col">
        <Typography text="small" ellipsis left>
          {title}
        </Typography>
        <div className="flex flex-row items-center justify-end">
          <DefaultButton onClick={onClickDetails}>
            <IoIosInformationCircleOutline className="text-text-primary min-w-18 min-h-18" />
          </DefaultButton>
        </div>
      </div>
    </div>
  )
}

export default memo(Book)
