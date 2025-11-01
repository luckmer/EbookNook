import UploadButton from '@components/Buttons/UploadButton'
import { Typography } from '@components/Typography'
import { FC, memo } from 'react'

export interface IProps {
  onClick: (file: File) => void
}

const EmptyLibrary: FC<IProps> = ({ onClick }) => {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col gap-32 max-w-[600px] mx-auto">
      <Typography text="h1" class="text-[48px]! leading-[50px]">
        Your library
      </Typography>
      <Typography text="body" center>
        Step into your library, where every book is a friend waiting to be discovered, any time you
        wish.
      </Typography>
      <div className="flex">
        <UploadButton label="Import books" onClick={onClick} />
      </div>
    </div>
  )
}

export default memo(EmptyLibrary)
