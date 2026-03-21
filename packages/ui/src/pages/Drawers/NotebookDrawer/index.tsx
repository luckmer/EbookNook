import { Highlights } from '@bindings/highlights'
import { Note, Notes } from '@bindings/notes'
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
  onClickSave: (id: string, note: Note) => void
  onClickDeleteHighlight: (id: string) => void
  onClickDeleteNote: (id: string) => void
  onClickFocusNote: (note: Note) => void
  onClickCancel: () => void
  onClickClose: () => void
  isOpen: boolean
  highlights: Highlights
  notes: Notes
  isLoader: boolean
  editingNoteId: string
}

const NotebookDrawer: FC<IProps> = ({
  onClickClose,
  onClickDeleteHighlight,
  onClickDeleteNote,
  onClickCancel,
  onClickFocusNote,
  onClickSave,
  isOpen,
  highlights,
  notes,
  isLoader,
  editingNoteId,
}) => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null)
  const [noteLabel, setNoteLabel] = useState('')

  useEffect(() => {
    if (isOpen) {
      setOpenDropdownIndex(null)
    }
    if (isOpen && editingNoteId.trim().length > 0) {
      setNoteLabel('')
    }
  }, [editingNoteId])

  const handleDeleteHighlight = useCallback(
    (id: string) => {
      setOpenDropdownIndex(null)
      onClickDeleteHighlight(id)
    },
    [onClickDeleteHighlight],
  )

  const handleDeleteNote = useCallback(
    (id: string) => {
      setOpenDropdownIndex(null)
      onClickDeleteNote(id)
    },
    [onClickDeleteNote],
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
            <Show when={highlights.length > 0}>
              <Typography text="caption">Excerpts</Typography>
            </Show>
            <div className="flex flex-col gap-12">
              {highlights.map((item, index) => (
                <Dropdown
                  key={item.id}
                  label={item.label}
                  isOpen={openDropdownIndex === index}
                  onToggle={() => setOpenDropdownIndex((prev) => (prev === index ? null : index))}>
                  <Typography text="caption">{item.description}</Typography>
                  <div className="w-full flex items-center justify-end pt-12 gap-12">
                    <DefaultButton onClick={() => handleDeleteHighlight(item.id)}>
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
                const isEditing = editingNoteId.includes(item.id)
                return (
                  <NoteDropdown
                    key={item.id}
                    label={item.label}
                    onClickFocus={() => {
                      if (isEditing) return
                      onClickFocusNote(item)
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
                            onClickFocusNote(item)
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
                                <DefaultButton onClick={() => handleDeleteNote(item.id)}>
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
                                onClickSave(noteLabel, item)
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
