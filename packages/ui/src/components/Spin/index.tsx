import { FC } from 'react'
import { FiLoader } from 'react-icons/fi'

export interface IProps {
  size?: number
}

const index: FC<IProps> = ({ size }) => {
  return <FiLoader className="animate-spin text-text-muted" size={size ?? 48} />
}

export default index
