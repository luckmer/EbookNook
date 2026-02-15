import Drawer from '@components/Drawer'
import Dropdown from '@components/Dropdown'
import Show from '@components/Show'
import { Typography } from '@components/Typography'
import { FC, useEffect, useState } from 'react'
import { LuNotebookPen } from 'react-icons/lu'

export interface IProps {
  onClickClose: () => void
  isOpen: boolean
  data: string[]
}

const NotebookDrawer: FC<IProps> = ({ onClickClose, isOpen, data }) => {
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
                label={item}
                key={index}
                isOpen={openDropdownIndex === index}
                onToggle={() => handleToggleDropdown(index)}>
                <Typography text="caption">{item}</Typography>
              </Dropdown>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export default NotebookDrawer
