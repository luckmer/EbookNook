import Show from '@components/Show'
import { Typography } from '@components/Typography'
import clsx from 'clsx'
import React, { JSX, memo } from 'react'

export interface IProps {
  label?: string
  onClick: (file: File) => void
  className?: string
  labelClassName?: string
  icon?: JSX.Element
}

const UploadButton: React.FC<IProps> = ({ label, onClick, className, labelClassName, icon }) => {
  return (
    <div className={clsx('flex flex-col', className)}>
      <label
        htmlFor="epubUpload"
        className={clsx(
          'cursor-pointer h-full text-white-100 px-48 py-13 bg-black-200 rounded-9 transition-colors duration-300 hover:bg-hover-black-200',
          labelClassName
        )}>
        <Show when={typeof label !== 'undefined'} fallback={<>{icon}</>}>
          <Typography>{label}</Typography>
        </Show>
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
