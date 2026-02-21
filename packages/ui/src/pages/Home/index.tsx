import { Book as IBook } from '@bindings/epub'
import BookShelf from '@components/BookShelf'
import EmptyLibrary from '@components/EmptyBookShelf'
import EmptyResult from '@components/EmptyResult'
import Show from '@components/Show'
import Spin from '@components/Spin'
import { FC, memo } from 'react'

export interface IProps {
  onClick: (file: File) => void
  onClickBook: (id: string) => void
  onClickDetails: (id: string) => void
  books: IBook[]
  hasBooks: boolean
  isLoadingState: boolean
}

const Home: FC<IProps> = ({
  onClick,
  onClickBook,
  onClickDetails,
  books,
  hasBooks,
  isLoadingState,
}) => {
  return (
    <main className="w-full h-full overflow-y-auto px-24 py-12">
      <Show
        when={isLoadingState}
        fallback={
          <Show when={hasBooks} fallback={<EmptyLibrary onClick={onClick} />}>
            <Show when={books.length > 0 && hasBooks} fallback={<EmptyResult />}>
              <BookShelf
                books={books}
                onClickImportBook={onClick}
                onClickBook={onClickBook}
                onClickDetails={onClickDetails}
              />
            </Show>
          </Show>
        }>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Spin />
        </div>
      </Show>
    </main>
  )
}

export default memo(Home)
