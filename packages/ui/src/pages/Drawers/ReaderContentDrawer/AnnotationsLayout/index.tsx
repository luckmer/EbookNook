import type { IBindingsBookmark } from '@bindings/bookmarks'
import type { IBindingsNote } from '@bindings/notes'
import AnnotationCard from '@components/Cards/AnnotationCard'
import Match from '@components/Match'
import Show from '@components/Show'
import Switch from '@components/Switch'
import { Typography } from '@components/Typography'
import { ANNOTATION_OPTIONS } from '@interfaces/contentDrawer/enums'
import { LOADER_STATE, LOADER_STATUS } from '@interfaces/ui/enums'
import type { LoaderState } from '@interfaces/ui/types'
import { Empty, Segmented, Skeleton } from 'antd'
import { type FC, memo, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface IProps {
  onClick: (bookmark: IBindingsBookmark) => void
  onClickNote: (note: IBindingsNote) => void
  onClickDelete: (id: string, cfi: string) => void
  onClickDeleteNote: (id: string, noteId: string, page: string) => void
  onClickEdit: (bookmark: IBindingsBookmark) => void
  onClickEditNote: (note: IBindingsNote) => void
  scopedLoader: Partial<Record<string, Partial<Record<string, LoaderState>>>>
  bookmarks: Array<IBindingsBookmark>
  notes: Array<IBindingsNote>
  isLoader: boolean
}

const AnnotationsLayout: FC<IProps> = ({
  scopedLoader,
  bookmarks,
  isLoader,
  notes,
  onClick,
  onClickDelete,
  onClickDeleteNote,
  onClickEditNote,
  onClickNote,
  onClickEdit,
}) => {
  const [option, setOption] = useState<ANNOTATION_OPTIONS>(ANNOTATION_OPTIONS.ALL)
  const { t } = useTranslation()

  const hasNoData = useMemo(() => {
    return notes.length === 0 && bookmarks.length === 0
  }, [notes, bookmarks])

  return (
    <Show
      when={!isLoader}
      fallback={
        <div className='pr-24'>
          <Skeleton active />
        </div>
      }>
      <div className='pb-12 pr-24'>
        <Segmented
          block
          value={option}
          onChange={setOption}
          style={{
            gap: 4,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          options={[
            {
              label: <Typography>{t('all')}</Typography>,
              value: ANNOTATION_OPTIONS.ALL,
            },
            {
              label: <Typography>{t('notes')}</Typography>,
              value: ANNOTATION_OPTIONS.NOTES,
            },
            {
              label: <Typography>{t('bookmarks')}</Typography>,
              value: ANNOTATION_OPTIONS.BOOKMARKS,
            },
          ]}
        />
      </div>
      <div className='pr-24 flex flex-col gap-6'>
        <Switch>
          <Match when={option === ANNOTATION_OPTIONS.ALL && hasNoData}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </Match>
          <Match
            when={option === ANNOTATION_OPTIONS.BOOKMARKS || option === ANNOTATION_OPTIONS.ALL}>
            <Show
              when={bookmarks.length > 0}
              fallback={
                option === ANNOTATION_OPTIONS.BOOKMARKS && (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )
              }>
              {bookmarks.map((bookmark) => (
                <AnnotationCard
                  isDeleting={
                    scopedLoader[bookmark.bookId]?.[LOADER_STATE.IS_DELETING_BOOKMARK]?.status ===
                    LOADER_STATUS.LOADING
                  }
                  isUpdating={
                    scopedLoader[bookmark.bookId]?.[LOADER_STATE.IS_UPDATING_BOOKMARK]?.status ===
                    LOADER_STATUS.LOADING
                  }
                  onClickDelete={() => {
                    onClickDelete(bookmark.bookId, bookmark.cfi)
                  }}
                  onClickEdit={(label) => {
                    onClickEdit({
                      ...bookmark,
                      title: label,
                    })
                  }}
                  onClick={() => {
                    onClick(bookmark)
                  }}
                  key={bookmark.cfi}
                  chapter={bookmark.chapter}
                  title={bookmark.title}
                  createdAt={bookmark.createdAt}
                />
              ))}
            </Show>
          </Match>
          <Match when={option === ANNOTATION_OPTIONS.NOTES || option === ANNOTATION_OPTIONS.ALL}>
            <Show
              when={notes.length > 0}
              fallback={
                option === ANNOTATION_OPTIONS.NOTES && (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )
              }>
              {notes.map((note) => (
                <AnnotationCard
                  ellipsis={false}
                  background={note.color}
                  isDeleting={
                    scopedLoader[note.noteId]?.[LOADER_STATE.IS_DELETING_NOTE]?.status ===
                    LOADER_STATUS.LOADING
                  }
                  isUpdating={
                    scopedLoader[note.noteId]?.[LOADER_STATE.IS_UPDATING_NOTE]?.status ===
                    LOADER_STATUS.LOADING
                  }
                  onClickDelete={() => {
                    onClickDeleteNote(note.bookId, note.noteId, note.page)
                  }}
                  onClickEdit={(label) => {
                    onClickEditNote({
                      ...note,
                      title: label,
                    })
                  }}
                  onClick={() => {
                    onClickNote(note)
                  }}
                  key={note.value}
                  chapter={note.title}
                  title={note.text.length > 150 ? `${note.text.slice(0, 150)}...` : note.text}
                  createdAt={note.createdAt}
                />
              ))}
            </Show>
          </Match>
        </Switch>
      </div>
    </Show>
  )
}

export default memo(AnnotationsLayout)
