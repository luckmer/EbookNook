import { Typography } from '@components/Typography'
import { FC } from 'react'

export interface IProps {
  label: string
  description: string
}

const ContentMeta: FC<IProps> = ({ label, description }) => {
  return (
    <div className="flex flex-col gap-4">
      <Typography text="caption">{label}</Typography>
      <Typography text="small" color="muted">
        {description}
      </Typography>
    </div>
  )
}

export default ContentMeta
