import DefaultInput from '@components/Inputs/DefaultInput'
import Show from '@components/Show'
import { Typography } from '@components/Typography'
import { FC, useEffect, useRef, useState } from 'react'

interface IProps {
  onChange?: (value: string) => void
  onClickFocus: () => void
  placeholder?: string
  value?: string
  children: (isOpen: boolean) => React.ReactNode
  label: string
  isEditing?: boolean
}

const NoteDropdown: FC<IProps> = ({
  onChange,
  onClickFocus,
  placeholder,
  value,
  isEditing,
  children,
  label,
}) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number>(0)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  useEffect(() => {
    setTimeout(() => {
      const el = contentRef.current
      if (!el) return
      setHeight(
        isEditing ? el.scrollHeight : isOpen || isEditing ? el.scrollHeight : el.scrollHeight - 28,
      )
    }, 100)
  }, [isOpen, isEditing])

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className="flex flex-col p-12 bg-base rounded-12 border border-border-popover">
      <div
        className="flex flex-row gap-6 select-none h-full items-center justify-start cursor-pointer"
        onClick={() => onClickFocus()}>
        <Show
          when={isEditing ?? false}
          fallback={
            <Typography ellipsis text="caption">
              {label}
            </Typography>
          }>
          <DefaultInput
            className="h-full w-full py-8 rounded-4 px-12 font-ubuntu"
            onChange={(value) => onChange?.(value)}
            value={value ?? ''}
            placeholder={placeholder ?? '----'}
          />
        </Show>
      </div>
      <div
        style={{ height: `${height}px` }}
        className="overflow-hidden transition-[height] duration-150 ease-in-out">
        <div ref={contentRef}>{children(isEditing ? true : isOpen)}</div>
      </div>
    </div>
  )
}

export default NoteDropdown
