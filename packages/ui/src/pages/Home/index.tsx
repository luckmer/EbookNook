import EmptyLibrary from '@pages/EmptyLibrary'
import { FC, memo } from 'react'

export interface IProps {
  onClick: (file: File) => void
}

const Home: FC<IProps> = ({ onClick }) => {
  return (
    <main className="w-full h-full">
      <EmptyLibrary onClick={onClick} />
    </main>
  )
}

export default memo(Home)
