import { ANNOTATIONS_STATUS } from '@interfaces/annotations/enums'
import { FC } from 'react'

export interface IProps {
  getStatus: (id: string) => ANNOTATIONS_STATUS
  onClickSave: (id: string, note: unknown) => void
  onClickDeleteHighlight: (id: string) => void
  onClickDeleteNote: (id: string) => void
  onClickFocusNote: (note: unknown) => void
  onClickCancel: () => void
  onClickClose: () => void
  isOpen: boolean
  highlights: unknown[]
  notes: unknown
  isFetchingNotesStructure: boolean
  isFetchingHighlightsStructure: boolean
}

const NotebookDrawer: FC<IProps> = (
  {
    // onClickClose,
    // onClickDeleteHighlight,
    // onClickDeleteNote,
    // onClickCancel,
    // onClickFocusNote,
    // onClickSave,
    // getStatus,
    // isOpen,
    // highlights,
    // notes,
    // isFetchingNotesStructure,
    // isFetchingHighlightsStructure,
  },
) => {
  // const { t } = useTranslation()
  // const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null)
  // const [noteLabel, setNoteLabel] = useState('')
  // const { width } = useWindowSize()

  // const isMobile = useMemo(() => width <= 700, [width])

  // useEffect(() => {
  //   if (isOpen) {
  //     setOpenDropdownIndex(null)
  //   }
  //   if (isOpen) {
  //     setNoteLabel('')
  //   }
  // }, [isOpen])

  // const handleDeleteHighlight = useCallback(
  //   (id: string) => {
  //     setOpenDropdownIndex(null)
  //     onClickDeleteHighlight(id)
  //   },
  //   [onClickDeleteHighlight],
  // )

  // const handleDeleteNote = useCallback(
  //   (id: string) => {
  //     setOpenDropdownIndex(null)
  //     onClickDeleteNote(id)
  //   },
  //   [onClickDeleteNote],
  // )

  return (
    <></>
    // <Drawer
    //   onClickClose={onClickClose}
    //   isOpen={isOpen}
    //   placement={isMobile ? 'bottom' : 'right'}
    //   height={isMobile ? '80%' : '100%'}>
    //   <div className="flex flex-col gap-12">
    //     <div className="flex w-full items-center justify-center gap-4">
    //       <LuNotebookPen className="w-18 h-18 transition-colors duration-200" />
    //       <Typography text="body">{t('notebook')}</Typography>
    //     </div>
    //     <Show when={!isFetchingHighlightsStructure} fallback={<Skeleton active avatar />}>
    //       <div className="h-full flex flex-col gap-12">
    //         <Show when={highlights.length > 0}>
    //           <Typography text="caption">{t('excerpts')}</Typography>
    //         </Show>
    //         <div className="flex flex-col gap-12">
    //           {highlights.map((item, index) => (
    //             <Dropdown
    //               key={item.id}
    //               label={item.label}
    //               isPending={item.isPending}
    //               isOpen={openDropdownIndex === index}
    //               onToggle={() => setOpenDropdownIndex((prev) => (prev === index ? null : index))}>
    //               <Typography text="caption">{item.description}</Typography>
    //               <div className="w-full flex items-center justify-end pt-12 gap-12">
    //                 <DefaultButton
    //                   onClick={() => handleDeleteHighlight(item.id)}
    //                   disabled={getStatus(item.id) === ANNOTATIONS_STATUS.PENDING}>
    //                   <Typography color="error">
    //                     {getStatus(item.id) === ANNOTATIONS_STATUS.PENDING
    //                       ? t('deleting')
    //                       : t('delete')}
    //                   </Typography>
    //                 </DefaultButton>
    //               </div>
    //             </Dropdown>
    //           ))}
    //         </div>
    //       </div>
    //     </Show>
    //     <Show when={!isFetchingNotesStructure} fallback={<Skeleton active avatar />}>
    //       <div className="h-full flex flex-col gap-12">
    //         <Show when={notes.length > 0}>
    //           <Typography text="caption">{t('notes')}</Typography>
    //         </Show>
    //         <div className="flex flex-col gap-12">
    //           {notes.map((item) => {
    //             const isEditing = !item.label.trim().length
    //             return (
    //               <NoteDropdown
    //                 key={item.id}
    //                 label={item.label}
    //                 onClickFocus={() => {
    //                   if (isEditing) return
    //                   onClickFocusNote(item)
    //                 }}
    //                 placeholder={t('notesPlaceholder')}
    //                 value={noteLabel}
    //                 onChange={setNoteLabel}
    //                 isEditing={isEditing}
    //                 isPending={getStatus(item.id) === ANNOTATIONS_STATUS.PENDING}>
    //                 {(isOpen) => (
    //                   <div className="flex flex-col">
    //                     <div
    //                       data-peek="true"
    //                       onClick={() => {
    //                         if (isEditing) return
    //                         onClickFocusNote(item)
    //                       }}
    //                       className="pt-12 cursor-pointer">
    //                       <Typography text="caption" class="cursor-pointer">
    //                         {trimText(200)(item.description)}
    //                       </Typography>
    //                     </div>
    //                     <div
    //                       className={clsx(
    //                         'w-full flex items-center justify-end pt-12 gap-12 transition-opacity duration-100 ease-in-out',
    //                         isOpen || isEditing ? 'opacity-100' : 'opacity-0 pointer-events-none',
    //                       )}>
    //                       <Show
    //                         when={isEditing}
    //                         fallback={
    //                           <div className="flex flex-row items-center gap-12">
    //                             <DefaultButton
    //                               disabled={getStatus(item.id) === ANNOTATIONS_STATUS.PENDING}
    //                               onClick={() => handleDeleteNote(item.id)}>
    //                               <Typography color="error">
    //                                 {getStatus(item.id) === ANNOTATIONS_STATUS.PENDING
    //                                   ? t('deleting')
    //                                   : t('delete')}
    //                               </Typography>
    //                             </DefaultButton>
    //                           </div>
    //                         }>
    //                         <DefaultButton
    //                           disabled={getStatus(item.id) === ANNOTATIONS_STATUS.PENDING}
    //                           onClick={() => {
    //                             setNoteLabel('')
    //                             onClickCancel()
    //                           }}>
    //                           <Typography color="blue">{t('cancel')}</Typography>
    //                         </DefaultButton>
    //                         <DefaultButton
    //                           disabled={
    //                             getStatus(item.id) === ANNOTATIONS_STATUS.PENDING ||
    //                             !noteLabel.trim().length
    //                           }
    //                           onClick={() => {
    //                             setNoteLabel('')
    //                             onClickSave(noteLabel, item)
    //                           }}>
    //                           <Typography color="blue">{t('save')}</Typography>
    //                         </DefaultButton>
    //                       </Show>
    //                     </div>
    //                   </div>
    //                 )}
    //               </NoteDropdown>
    //             )
    //           })}
    //         </div>
    //       </div>
    //     </Show>
    //   </div>
    // </Drawer>
  )
}

export default NotebookDrawer
