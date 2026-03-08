import { Annotations } from '@bindings/annotations'
import DefaultButton from '@components/Buttons/DefaultButton'
import Drawer from '@components/Drawer'
import Dropdown from '@components/Dropdowns/Dropdown'
import NoteDropdown from '@components/Dropdowns/NoteDropdown'
import Show from '@components/Show'
import { Typography } from '@components/Typography'
import { trimText } from '@web-utils/index'
import { Skeleton } from 'antd'
import clsx from 'clsx'
import { FC, useCallback, useEffect, useState } from 'react'
import { LuNotebookPen } from 'react-icons/lu'

export interface IProps {
  onClickSave: (id: string, label: string) => void
  onClickDelete: (id: string) => void
  onClickFocus: (text: string, id: string) => void
  onClickCancel: () => void
  onClickClose: () => void
  isOpen: boolean
  data: Annotations
  notes: Annotations
  isLoader: boolean
  noteId: string
}

const NotebookDrawer: FC<IProps> = ({
  onClickClose,
  onClickDelete,
  onClickCancel,
  onClickFocus,
  onClickSave,
  isOpen,
  data,
  notes,
  isLoader,
  noteId,
}) => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null)
  const [noteLabel, setNoteLabel] = useState('')

  useEffect(() => {
    if (isOpen) {
      setOpenDropdownIndex(null)
    }
    if (isOpen && noteId.trim().length > 0) {
      setNoteLabel('')
    }
  }, [isOpen, noteId])

  const handleDelete = useCallback(
    (id: string) => {
      setOpenDropdownIndex(null)
      onClickDelete(id)
    },
    [onClickDelete],
  )

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
            <div className="flex flex-col gap-12">
              {data.map((item, index) => (
                <Dropdown
                  key={item.id}
                  label={item.label}
                  isOpen={openDropdownIndex === index}
                  onToggle={() => setOpenDropdownIndex((prev) => (prev === index ? null : index))}>
                  <Typography text="caption">{item.description}</Typography>
                  <div className="w-full flex items-center justify-end pt-12 gap-12">
                    <DefaultButton onClick={() => handleDelete(item.id)}>
                      <Typography color="error">Delete</Typography>
                    </DefaultButton>
                  </div>
                </Dropdown>
              ))}
            </div>
          </div>
          <div className="h-full flex flex-col gap-12">
            <Show when={notes.length > 0}>
              <Typography text="caption">Notes</Typography>
            </Show>
            <div className="flex flex-col gap-12">
              {notes.map((item) => {
                const isEditing = noteId.includes(item.id)
                return (
                  <NoteDropdown
                    key={item.id}
                    label={item.label}
                    onClickFocus={() => {
                      if (isEditing) return
                      onClickFocus(item.description, item.id)
                    }}
                    placeholder="Add your notes here..."
                    value={noteLabel}
                    onChange={setNoteLabel}
                    isEditing={isEditing}>
                    {(isOpen) => (
                      <div className="flex flex-col">
                        <div
                          onClick={() => {
                            if (isEditing) return
                            onClickFocus(item.description, item.id)
                          }}
                          className="pt-12 cursor-pointer">
                          <Typography text="caption" class="cursor-pointer">
                            {trimText(200)(item.description)}
                          </Typography>
                        </div>
                        <div
                          className={clsx(
                            'w-full flex items-center justify-end pt-12 gap-12 transition-opacity duration-100 ease-in-out',
                            isOpen || isEditing ? 'opacity-100' : 'opacity-0 pointer-events-none',
                          )}>
                          <Show
                            when={isEditing}
                            fallback={
                              <div className="flex flex-row items-center gap-12">
                                <DefaultButton onClick={() => handleDelete(item.id)}>
                                  <Typography color="error">Delete</Typography>
                                </DefaultButton>
                              </div>
                            }>
                            <DefaultButton
                              onClick={() => {
                                setNoteLabel('')
                                onClickCancel()
                              }}>
                              <Typography color="blue">Cancel</Typography>
                            </DefaultButton>
                            <DefaultButton
                              onClick={() => {
                                setNoteLabel('')
                                onClickSave(item.description, noteLabel)
                              }}>
                              <Typography color="blue">Save</Typography>
                            </DefaultButton>
                          </Show>
                        </div>
                      </div>
                    )}
                  </NoteDropdown>
                )
              })}
            </div>
          </div>
        </div>
      </Show>
    </Drawer>
  )
}

export default NotebookDrawer
