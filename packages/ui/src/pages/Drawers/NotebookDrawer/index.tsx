import Drawer from '@components/Drawer'
import Dropdown from '@components/Dropdown'
import Show from '@components/Show'
import { Typography } from '@components/Typography'
import { Skeleton } from 'antd'
import { FC, useEffect, useState } from 'react'
import { LuNotebookPen } from 'react-icons/lu'

export interface IAnnotation {
  label: string
  description: string
}

export interface IProps {
  onClickClose: () => void
  isOpen: boolean
  data: IAnnotation[]
  isLoader: boolean
}

const NotebookDrawer: FC<IProps> = ({ onClickClose, isOpen, data, isLoader }) => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null)

  const handleToggleDropdown = (index: number) => {
    setOpenDropdownIndex((prev) => (prev === index ? null : index))
  }

  useEffect(() => {
    if (isOpen) {
      setOpenDropdownIndex(null)
    }
  }, [isOpen])

  return (
    <Drawer onClickClose={onClickClose} isOpen={isOpen} placement="right">
      <Show when={!isLoader} fallback={<Skeleton active avatar />}>
        <div className="flex flex-col gap-12">
          <div className="flex w-full items-center justify-center gap-4">
            <LuNotebookPen className="w-18 h-18 transition-colors duration-200" />
            <Typography text="body">Notebook</Typography>
          </div>
          <div className="h-full flex flex-col gap-12">
            <Show when={data.length > 0}>
              <Typography text="caption">Excerpts</Typography>
            </Show>
            <div className=" flex flex-col gap-12">
              {data.map((item, index) => (
                <Dropdown
                  label={item.label}
                  key={index}
                  isOpen={openDropdownIndex === index}
                  onToggle={() => handleToggleDropdown(index)}>
                  <Typography text="caption">{item.description}</Typography>
                </Dropdown>
              ))}
            </div>
          </div>
        </div>
      </Show>
    </Drawer>
  )
}

export default NotebookDrawer
