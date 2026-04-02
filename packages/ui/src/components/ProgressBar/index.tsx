import { FC } from 'react'

interface IProps {
  duration: number
  color: string
  paused: boolean
}

const ProgressBar: FC<IProps> = ({ duration, paused, color }) => (
  <div className="absolute bottom-0 left-0 right-0 h-2 overflow-hidden rounded-tl-xl rounded-tr-xl">
    <div
      className="h-full rounded-sm origin-left animate-shrink"
      style={{
        animationDuration: `${duration}ms`,
        animationPlayState: paused ? 'paused' : 'running',
        background: color,
      }}
    />
  </div>
)

export default ProgressBar
