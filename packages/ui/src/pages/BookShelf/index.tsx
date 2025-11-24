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
    <div className=" grid w-full grid-cols-[repeat(auto-fill,minmax(clamp(160px,16px,160px),1fr))] gap-12">
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
        icon={<MdAddToPhotos className="fill-text-disabled w-[80%] h-full " />}
        labelClassName="bg-base hover:bg-surface-drawer w-full"
      />
    </div>
  )
}

export default memo(BookShelf)
