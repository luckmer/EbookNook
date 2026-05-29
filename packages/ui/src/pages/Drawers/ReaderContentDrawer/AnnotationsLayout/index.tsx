import type { IBindingsBookmark } from '@bindings/bookmarks'
import Bookmark from '@components/Bookmark'
import type { FC } from 'react'

export interface IProps {
  bookmarks: Array<IBindingsBookmark>
  onClick: (bookmark: IBindingsBookmark) => void
}

const AnnotationsLayout: FC<IProps> = ({ bookmarks, onClick }) => {
  return (
    <div className='pr-24 flex flex-col gap-6'>
      {bookmarks.map((bookmark) => (
        <Bookmark
          onClick={() => {
            onClick(bookmark)
          }}
          key={bookmark.cfi}
          chapter={bookmark.chapter}
          title={bookmark.title}
          createdAt={bookmark.createdAt}
        />
      ))}
    </div>
  )
}

export default AnnotationsLayout
