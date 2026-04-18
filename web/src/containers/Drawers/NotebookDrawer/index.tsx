// import { ANNOTATIONS_STATUS } from '@interfaces/annotations/enums'
// import NotebookDrawer from '@pages/Drawers/NotebookDrawer'
// import { uiSelector } from '@store/selectors/ui'
// import { useMemo } from 'react'
// import { useSelector } from 'react-redux'
// import { useLocation } from 'react-router-dom'

// const NotebookDrawerRoot = () => {
//   const isFetchingHighlightsStructure = useSelector(uiSelector.isFetchingHighlightsStructure)
//   const isFetchingNotesStructure = useSelector(uiSelector.isFetchingNotesStructure)
//   const isOpen = useSelector(uiSelector.openNotebook)
//   const location = useLocation()
//   // const dispatch = useDispatch()

//   const bookId = useMemo(() => location?.state?.id, [location])

//   const highlights = useMemo(() => {
//     // return highlightsMap[bookId] ?? []
//     return []
//   }, [bookId])

//   const notes = useMemo(() => {
//     // return notesMap[bookId] ?? []
//     return []
//   }, [bookId])

//   // const hasInvalidNotes = useMemo(() => {
//   //   return notes
//   //     .filter((note) => {
//   //       const pending = status[note.id] === ANNOTATIONS_STATUS.PENDING
//   //       return note.label === '' && !pending
//   //     })
//   //     .map((note) => note.id)
//   // }, [notes, status])

//   return (
//     // <NotebookDrawer
//     //   isOpen={isOpen}
//     //   highlights={highlights}
//     //   notes={notes}
//     //   isFetchingNotesStructure={isFetchingNotesStructure}
//     //   isFetchingHighlightsStructure={isFetchingHighlightsStructure}
//     //   getStatus={() => ANNOTATIONS_STATUS.IDLE}
//     //   onClickDeleteHighlight={() => {
//     //     // dispatch(annotationActions.setDeleteHighlightById({ id, bookId }))
//     //   }}
//     //   onClickDeleteNote={() => {
//     //     // dispatch(annotationActions.setDeleteNoteById({ id, bookId }))
//     //     // if (selectedAnnotation !== null && selectedAnnotation.anchorId === id) {
//     //     //   dispatch(annotationActions.setSelectedAnnotation(null))
//     //     // }
//     //   }}
//     //   onClickClose={() => {
//     //     // if (hasInvalidNotes.length > 0) {
//     //     //   dispatch(annotationActions.deleteNotesByIds({ ids: hasInvalidNotes, bookId }))
//     //     // }
//     //     // dispatch(uiActions.setOpenNotebook(false))
//     //   }}
//     //   onClickCancel={() => {
//     //     // if (hasInvalidNotes.length > 0) {
//     //     //   dispatch(annotationActions.deleteNotesByIds({ ids: hasInvalidNotes, bookId }))
//     //     // }
//     //     // dispatch(uiActions.setOpenNotebook(false))
//     //   }}
//     //   onClickFocusNote={() => {
//     //     // dispatch(uiActions.setOpenNotebook(false))
//     //     // dispatch(
//     //     //   annotationActions.setSelectedAnnotation({
//     //     //     anchorId: note.id,
//     //     //     anchor: {
//     //     //       normEnd: note.normEnd,
//     //     //       normStart: note.normStart,
//     //     //       text: note.description,
//     //     //     },
//     //     //   }),
//     //     // )
//     //   }}
//     //   onClickSave={() => {
//     //     // dispatch(
//     //     //   annotationActions.setSaveNote({
//     //     //     id: bookId,
//     //     //     note: {
//     //     //       ...note,
//     //     //       label,
//     //     //     },
//     //     //   }),
//     //     // )
//     //     // console.log(note, status)
//     //   }}
//     // />
//   )
// }

// export default NotebookDrawerRoot
