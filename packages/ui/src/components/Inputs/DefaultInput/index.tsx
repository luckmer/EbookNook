import clsx from 'clsx'
import { FC, memo } from 'react'

export interface IProps {
  id?: string
  name?: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  className?: string
}

const DefaultInput: FC<IProps> = ({ id, name, className, placeholder, value, onChange }) => {
  return (
    <input
      id={id}
      name={name}
      className={clsx(
        'w-full',
        'placeholder:text-[14px] placeholder:text-white-100/60 outline-none',
        className
      )}
      placeholder={placeholder}
      value={value}
      onChange={(e) => {
        e.preventDefault()
        onChange(e.target.value)
      }}
    />
  )
}

export default memo(DefaultInput)
