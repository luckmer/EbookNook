import type { IBindingsBookmark } from '@bindings/bookmarks'
import Bookmark from '@components/Bookmark'
import Show from '@components/Show'
import { LOADER_STATE, LOADER_STATUS } from '@interfaces/ui/enums'
import type { LoaderState } from '@interfaces/ui/types'
import { Empty, Skeleton } from 'antd'
import { type FC, memo } from 'react'

export interface IProps {
  onClick: (bookmark: IBindingsBookmark) => void
  onClickDelete: (id: string, cfi: string) => void
  onClickEdit: (bookmark: IBindingsBookmark) => void
  scopedLoader: Partial<Record<string, Partial<Record<string, LoaderState>>>>
  bookmarks: Array<IBindingsBookmark>
  isLoader: boolean
}

const AnnotationsLayout: FC<IProps> = ({
  scopedLoader,
  bookmarks,
  isLoader,
  onClick,
  onClickDelete,
  onClickEdit,
}) => {
  return (
    <Show
      when={!isLoader}
      fallback={
        <div className='pr-24'>
          <Skeleton active />
        </div>
      }>
      <div className='pr-24 flex flex-col gap-6'>
        <Show when={bookmarks.length > 0} fallback={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}>
          {bookmarks.map((bookmark) => (
            <Bookmark
              isDeletingBookmark={
                scopedLoader[bookmark.bookId]?.[LOADER_STATE.IS_DELETING_BOOKMARK]?.status ===
                LOADER_STATUS.LOADING
              }
              isUpdatingBookmark={
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
      </div>
    </Show>
  )
}

export default memo(AnnotationsLayout)
