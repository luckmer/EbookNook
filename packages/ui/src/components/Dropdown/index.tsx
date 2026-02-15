import { Typography } from '@components/Typography'
import clsx from 'clsx'
import { FC, useEffect, useRef, useState } from 'react'
import { IoIosArrowUp } from 'react-icons/io'

interface IProps {
  children: React.ReactNode
  label: string
  isOpen: boolean
  onToggle: () => void
}

const Dropdown: FC<IProps> = ({ children, label, isOpen, onToggle }) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number>(0)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0)
    }
  }, [isOpen, children])

  return (
    <div className="flex flex-col p-12 bg-base rounded-12 border border-border-popover">
      <div
        className="flex flex-row gap-6 cursor-pointer select-none group h-full items-center justify-center"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onToggle()
        }}>
        <IoIosArrowUp
          className={clsx(
            'transition-all duration-300 ease-in-out opacity-20 group-hover:opacity-100 min-w-[14px] min-h-[14px] max-w-[14px] max-h-[14px]',
            isOpen ? 'rotate-0 opacity-100' : 'rotate-180',
          )}
        />
        <Typography ellipsis text="caption">
          {label}
        </Typography>
      </div>
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
