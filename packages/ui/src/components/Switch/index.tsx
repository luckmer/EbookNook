import { type FC, memo, type ReactNode } from 'react'

export interface IProps {
  children: ReactNode
}

const Switch: FC<IProps> = ({ children }) => {
  return children
}

export default memo(Switch)
