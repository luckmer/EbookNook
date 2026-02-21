import UploadButton from '@components/Buttons/UploadButton'
import { Typography } from '@components/Typography'
import { FC, memo } from 'react'

export interface IProps {
  onClick: (file: File) => void
}

const EmptyBookShelf: FC<IProps> = ({ onClick }) => {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col gap-32 max-w-[600px] mx-auto px-12">
      <Typography text="h1" class="text-[48px]! leading-[50px]">
        Your library
      </Typography>
      <Typography text="body" center>
        Welcome to your library! Import your books and start reading anytime.
      </Typography>
      <div className="flex">
        <UploadButton
          label="Import books"
          onClick={onClick}
          labelClassName="px-48 py-13"
          className="bg-button-primary-background rounded-6 hover:bg-button-primary-hover transition-colors duration-300"
        />
      </div>
    </div>
  )
}

export default memo(EmptyBookShelf)
