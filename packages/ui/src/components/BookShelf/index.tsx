import { FormatType } from '@bindings/format'
import Book from '@components/Book'
import UploadButton from '@components/Buttons/UploadButton'
import Show from '@components/Show'
import Spin from '@components/Spin'
import { IBookFile } from '@interfaces/book/interfaces'
import { FC, memo } from 'react'
import { MdAddToPhotos } from 'react-icons/md'

export interface IProps {
  onClickBook: (id: string, format: FormatType) => void
  onClickDetails: (id: string, formatType: FormatType) => void
  onClickImportBook: (file: File) => void
  isAddingBook: boolean
  books: IBookFile[]
}

const BookShelf: FC<IProps> = ({
  books,
  isAddingBook,
  onClickBook,
  onClickImportBook,
  onClickDetails,
}) => {
  return (
    <div className="grid flex-1 max-[450px]:grid-cols-1 grid-cols-2 px-4 sm:px-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-12 gap-12">
      {books.map((book, id) => (
        <Book
          key={id}
          progress={book.percentageProgress}
          img={book.cover}
          title={book.title}
          author={book.author}
          onClickDetails={() => {
            onClickDetails(book.id, book.format)
          }}
          onClick={() => {
            onClickBook(book.id, book.format)
          }}
        />
      ))}
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
          onClick={onClickImportBook}
          className="group flex items-center justify-center w-full h-full"
          icon={<MdAddToPhotos className="text-text-disabled w-1/3 h-auto" />}
          labelClassName="bg-base hover:bg-surface-drawer w-full h-full flex items-center justify-center rounded-6"
        />
      </div>
    </div>
  )
}

export default memo(BookShelf)
