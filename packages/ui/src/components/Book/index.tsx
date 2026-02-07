import DefaultButton from '@components/Buttons/DefaultButton'
import { Typography } from '@components/Typography'
import { Progress } from 'antd'
import { FC, memo } from 'react'
import { TfiMenuAlt } from 'react-icons/tfi'

export interface IProps {
  onClickDetails: () => void
  onClick: () => void
  img?: string
  title: string
  progress: string
}

const Book: FC<IProps> = ({ img, progress, title, onClick, onClickDetails }) => {
  return (
    <div
      className="group flex flex-col p-12 w-full gap-12 rounded-6 cursor-pointer transition-colors duration-300 hover:bg-button-primary-hover/40"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }}>
      <img className="rounded-6 h-full object-cover" src={img} />
      <div className="flex flex-col gap-12">
        <Typography text="small" ellipsis left>
          {title}
        </Typography>
        <div className="flex flex-row items-center  justify-between ">
          <Progress type="circle" percent={parseFloat(parseFloat(progress).toFixed(2))} size={18} />
          <DefaultButton
            onClick={onClickDetails}
            className="group-hover:opacity-100 opacity-0 duration-300 transition-opacity">
            <TfiMenuAlt className="text-text-primary min-w-18 min-h-18 max-h-18 max-w-18" />
          </DefaultButton>
        </div>
      </div>
    </div>
  )
}

export default memo(Book)
