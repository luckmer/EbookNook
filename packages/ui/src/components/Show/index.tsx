import React, { Fragment, ReactNode } from 'react'

interface ShowProps {
  when: boolean
  fallback?: ReactNode
  children: ReactNode
}

const Show: React.FC<ShowProps> = ({ when, fallback = null, children }) => {
  return <Fragment>{when ? children : fallback}</Fragment>
}

export default Show
