import DefaultButton from '@components/Buttons/DefaultButton'
import { Typography } from '@components/Typography'
import { FC, useMemo } from 'react'

export interface IProps {
  title: string
  chapter: string
  createdAt: string
  onClick: () => void
}

const Bookmark: FC<IProps> = ({ onClick, chapter, title, createdAt }) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const date = useMemo(() => {
    const d = new Date(+createdAt)
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} at ${d.getHours()}:${d.getMinutes()}`
  }, [createdAt])

  return (
    <DefaultButton className="flex flex-col gap-6 hover:bg-base" onClick={onClick}>
      <div className="bg-base py-6 px-4">
        <Typography class="text-left" ellipsis>
          {chapter}
        </Typography>
      </div>
      <div className="flex flex-col  py-4 px-4">
        <Typography class="text-left" text="caption">
          {date}
        </Typography>
        <Typography class="text-left" text="caption">
          {title}
        </Typography>
      </div>
    </DefaultButton>
  )
}

export default Bookmark
