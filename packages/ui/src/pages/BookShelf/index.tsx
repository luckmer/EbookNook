import Book from '@components/Book'
import UploadButton from '@components/Buttons/UploadButton'
import { FC, memo } from 'react'
import { MdAddToPhotos } from 'react-icons/md'
import { Book as IBook } from '@bindings/epub'

export interface IProps {
  onClickBook: (id: string) => void
  onClickDetails: (id: string) => void
  onClickImportBook: (file: File) => void
  books: IBook[]
}

const BookShelf: FC<IProps> = ({ books, onClickBook, onClickImportBook, onClickDetails }) => {
  console.log(books)
  return (
    <div className="grid flex-1 grid-cols-3 px-4 sm:px-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-12 gap-12">
      {books.map((book, id) => (
        <Book
          key={id}
          progress={book.progress.at(-1) ?? '0'}
          img={book.metadata.cover}
          title={book.metadata.title}
          onClickDetails={() => {
            onClickDetails(book.id)
          }}
          onClick={() => {
            onClickBook(book.id)
          }}
        />
      ))}
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
