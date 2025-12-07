import EmptyLibrary from '@pages/EmptyBookShelf'
import { FC, memo } from 'react'
import { IBook } from '@interfaces/book/interfaces'
import Show from '@components/Show'
import BookShelf from '@pages/BookShelf'
import EmptyResult from '@components/EmptyResult'

export interface IProps {
  onClick: (file: File) => void
  onClickBook: (hash: string) => void
  books: IBook[]
  hasBooks: boolean
}

const Home: FC<IProps> = ({ onClick, onClickBook, books, hasBooks }) => {
  return (
    <main className="w-full h-full overflow-y-auto px-24 py-12">
      <Show when={hasBooks} fallback={<EmptyLibrary onClick={onClick} />}>
        <Show when={books.length > 0 && hasBooks} fallback={<EmptyResult />}>
          <BookShelf books={books} onClickImportBook={onClick} onClickBook={onClickBook} />
        </Show>
      </Show>
    </main>
  )
}

export default memo(Home)
