import { FC, memo, ReactNode } from 'react'

export interface IProps {
  children: ReactNode
}

const Switch: FC<IProps> = ({ children }) => {
  return children
}

export default memo(Switch)
