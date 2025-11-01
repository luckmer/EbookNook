import { Typography } from '@components/Typography'
import React, { memo } from 'react'

export interface IProps {
  label: string
  onClick: (file: File) => void
}

const UploadButton: React.FC<IProps> = ({ label, onClick }) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor="epubUpload"
        className="cursor-pointer text-white-100 px-48 py-13 bg-black-200 rounded-9 transition-colors duration-300 hover:bg-hover-black-200">
        <Typography>{label}</Typography>
      </label>
      <input
        id="epubUpload"
        type="file"
        accept=".epub"
        onChange={(event) => {
          event.preventDefault()
          const file = event.target.files?.[0]
          if (file) {
            onClick(file)
          }
          event.target.value = ''
        }}
        className="hidden"
      />
    </div>
  )
}

export default memo(UploadButton)
