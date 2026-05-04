import { Typography } from '@components/Typography'
import { FC, memo } from 'react'

export interface IProps {
  author: string
  name: string
}

const ImgCover: FC<IProps> = ({ name, author }) => {
  return (
    <div className="w-full h-full bg-base rounded-6 flex flex-col justify-between items-center p-12 overflow-hidden">
      <Typography text="caption" class="line-clamp-3 text-center w-full wrap-break-word">
        {name}
      </Typography>
      <Typography class="truncate text-center w-full line-clamp-3">{author}</Typography>
    </div>
  )
}

export default memo(ImgCover)
