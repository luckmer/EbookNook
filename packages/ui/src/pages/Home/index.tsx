import EmptyLibrary from '@pages/EmptyBookShelf'
import { FC, memo } from 'react'
import { IBook } from '@interfaces/book/interfaces'
import Show from '@components/Show'
import BookShelf from '@pages/BookShelf'

export interface IProps {
  onClick: (file: File) => void
  onClickBook: (hash: string) => void
  books: IBook[]
}

const Home: FC<IProps> = ({ onClick, onClickBook, books }) => {
  return (
    <main className="w-full h-full overflow-y-auto px-24 py-12">
      <Show when={books.length > 0} fallback={<EmptyLibrary onClick={onClick} />}>
        <BookShelf books={books} onClickImportBook={onClick} onClickBook={onClickBook} />
      </Show>
    </main>
  )
}

export default memo(Home)
