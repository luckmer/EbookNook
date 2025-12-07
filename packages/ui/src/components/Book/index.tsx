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
      className="flex flex-col p-12 w-full gap-12 rounded-6 cursor-pointer transition-colors duration-300 hover:bg-button-primary-hover/40"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }}>
      <img className="rounded-6 h-full" src={img} />
      <Typography text="small" ellipsis left>
        {title}
      </Typography>
    </div>
  )
}

export default memo(Book)
