import DefaultButton from '@components/Buttons/DefaultButton'
import DefaultInput from '@components/Inputs/DefaultInput'
import Show from '@components/Show'
import { Typography } from '@components/Typography'
import SkeletonInput from 'antd/es/skeleton/Input'
import clsx from 'clsx'
import { FC, useEffect, useRef, useState } from 'react'
import { IoIosArrowUp } from 'react-icons/io'

interface IProps {
  onChange?: (value: string) => void
  placeholder?: string
  value?: string
  children: React.ReactNode
  label: string
  isOpen: boolean
  onToggle: () => void
  isEditing?: boolean
  isPending?: boolean
}

const Dropdown: FC<IProps> = ({
  onToggle,
  onChange,
  placeholder,
  value,
  isEditing,
  isPending,
  children,
  label,
  isOpen,
}) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number>(0)

  useEffect(() => {
    setTimeout(() => {
      if (contentRef.current) {
        setHeight(isOpen || isEditing ? contentRef.current.scrollHeight : 0)
      }
    }, 100)
  }, [isOpen, children, isEditing])

  return (
    <div className="flex flex-col p-12 bg-base rounded-12 border border-border-popover">
      <DefaultButton
        disabled={isPending || isEditing}
        className="flex flex-row gap-6 cursor-pointer select-none group h-full items-center justify-start"
        onClick={() => {
          onToggle()
        }}>
        <Show when={!isEditing && !isPending}>
          <IoIosArrowUp
            className={clsx(
              'transition-all duration-300 ease-in-out opacity-20 group-hover:opacity-100 min-w-[14px] min-h-[14px] max-w-[14px] max-h-[14px]',
              isOpen ? 'rotate-0 opacity-100' : 'rotate-180',
            )}
          />
        </Show>

        <Show
          when={!isPending}
          fallback={
            <div style={{ width: '100%', height: '16px' }}>
              <SkeletonInput active block style={{ height: '16px' }} />
            </div>
          }>
          <Show
            when={isEditing ?? false}
            fallback={
              <Typography ellipsis text="caption">
                {label}
              </Typography>
            }>
            <DefaultInput
              className=" h-full w-full py-8 rounded-4 px-12 font-ubuntu"
              onChange={(value) => {
                onChange?.(value)
              }}
              value={value ?? ''}
              placeholder={placeholder ?? '----'}
            />
          </Show>
        </Show>
      </DefaultButton>
      <div
        style={{ height: `${height}px` }}
        className="overflow-hidden transition-all duration-300 ease-in-out">
        <div ref={contentRef} className="pt-12">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Dropdown
