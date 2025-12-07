import Book from '@components/Book'
import UploadButton from '@components/Buttons/UploadButton'
import { IBook } from '@interfaces/book/interfaces'
import { FC, memo } from 'react'
import { MdAddToPhotos } from 'react-icons/md'

export interface IProps {
  onClickBook: (hash: string) => void
  onClickImportBook: (file: File) => void
  books: IBook[]
}

const BookShelf: FC<IProps> = ({ books, onClickBook, onClickImportBook }) => {
  return (
    <div className="grid flex-1 grid-cols-3 px-4 sm:px-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-12 gap-12">
      {books.map((book, id) => (
        <Book
          key={id}
          img={book.metadata.cover}
          title={book.metadata.title}
          onClick={() => {
            onClickBook(book.hash)
          }}
        />
      ))}
      <UploadButton
        onClick={onClickImportBook}
        className="group flex items-center justify-center transition-colors duration-300 w-full h-full"
        icon={<MdAddToPhotos className="fill-text-disabled w-[30%] h-full " />}
        labelClassName="bg-base hover:bg-surface-drawer duration-300 transition-colors w-full flex items-center rounded-6 justify-center h-full"
      />
    </div>
  )
}

export default memo(BookShelf)
