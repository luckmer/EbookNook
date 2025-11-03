import { Typography } from '@components/Typography'
import { FC, memo } from 'react'

export interface IProps {
  onClick: () => void
  img?: string
  title: string
}

const Book: FC<IProps> = ({ img, title, onClick }) => {
  return (
    <div
      className="flex flex-col gap-12 object-cover w-fit p-12 hover:bg-black-300 rounded-6 transition-colors duration-300 cursor-pointer"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }}>
      <img className="  rounded-6" src={img} />
      <div className="max-w-[140px]">
        <Typography text="small" ellipsis left>
          {title}
        </Typography>
      </div>
    </div>
  )
}

export default memo(Book)
