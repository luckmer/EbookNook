import { FormatType } from '@bindings/format'
import BookShelf from '@components/BookShelf'
import UploadButton from '@components/Buttons/UploadButton'
import EmptyLibrary from '@components/EmptyBookShelf'
import EmptyResult from '@components/EmptyResult'
import Show from '@components/Show'
import Spin from '@components/Spin'
import { IBookFile } from '@interfaces/book/interfaces'
import { FC, memo } from 'react'
import { MdAddToPhotos } from 'react-icons/md'

export interface IProps {
  onClick: (file: File) => void
  onClickBook: (id: string, format: FormatType) => void
  onClickDetails: (id: string, format: FormatType) => void
  books: IBookFile[]
  hasBooks: boolean
  isLoadingState: boolean
  isAddingBook: boolean
}

const Home: FC<IProps> = ({
  onClick,
  onClickBook,
  onClickDetails,
  books,
  hasBooks,
  isLoadingState,
  isAddingBook,
}) => {
  return (
    <main className="w-full h-full overflow-y-auto px-24 py-12">
      <Show
        when={isLoadingState}
        fallback={
          <Show
            when={hasBooks}
            fallback={
              <Show
                when={!isAddingBook}
                fallback={
                  <div className="grid flex-1 max-[450px]:grid-cols-1 grid-cols-2 px-4 sm:px-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-12 gap-12">
                    <Show when={isAddingBook}>
                      <div className="flex flex-col p-12 w-full gap-12 rounded-6">
                        <div className="w-full aspect-2/3 rounded-6 bg-base hover:bg-surface-drawer flex items-center justify-center">
                          <Spin />
                        </div>
                        <div className="flex flex-col gap-12">
                          <div className="h-12 w-3/4 rounded-4 bg-base animate-pulse" />
                          <div className="h-[20px] w-1/3 rounded-4 bg-base animate-pulse" />
                        </div>
                      </div>
                    </Show>
                    <div className="aspect-3/5 h-full w-full">
                      <UploadButton
                        onClick={onClick}
                        className="group flex items-center justify-center w-full h-full"
                        icon={<MdAddToPhotos className="text-text-disabled w-1/3 h-auto" />}
                        labelClassName="bg-base hover:bg-surface-drawer w-full h-full flex items-center justify-center rounded-6"
                      />
                    </div>
                  </div>
                }>
                <EmptyLibrary onClick={onClick} />
              </Show>
            }>
            <Show when={books.length > 0 && hasBooks} fallback={<EmptyResult />}>
              <BookShelf
                books={books}
                isAddingBook={isAddingBook}
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
