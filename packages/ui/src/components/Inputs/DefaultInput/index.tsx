import clsx from 'clsx'
import { type FC, memo } from 'react'

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
        'placeholder:text-[14px] placeholder:text-text-primary/60 text-text-primary outline-none',
        className,
      )}
      placeholder={placeholder}
      value={value}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onKeyUp={(e) => e.stopPropagation()}
      onChange={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onChange(e.target.value)
      }}
    />
  )
}
export default memo(DefaultInput)
