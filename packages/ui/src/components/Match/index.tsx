import { FC, ReactNode } from 'react'

export interface IProps {
  children: ReactNode
  when: boolean
}

const Match: FC<IProps> = ({ when, children }) => {
  return when && <>{children}</>
}

export default Match
