import Book from '@components/Book'
import UploadButton from '@components/Buttons/UploadButton'
import { IBook } from '@interfaces/book/interfaces'
import { FC, memo } from 'react'
import { MdAddToPhotos } from 'react-icons/md'

export interface IProps {
  books: IBook[]
}

const BookShelf: FC<IProps> = ({ books }) => {
  return (
    <div className=" grid w-full grid-cols-[repeat(auto-fill,minmax(clamp(160px,16px,160px),1fr))] gap-12">
      {books.map((book, id) => (
        <Book key={id} img={book.metadata.cover} title={book.metadata.title} />
      ))}
      <UploadButton
        onClick={() => {}}
        className="group p-12"
        icon={
          <MdAddToPhotos className="fill-grey-blue-200 group-hover:fill-hover-grey-blue-200 transition-colors duration-200 w-[80%] h-[80%] " />
        }
        labelClassName="bg-black-800 hover:bg-hover-black-800! flex items-center justify-center"
      />
    </div>
  )
}

export default memo(BookShelf)
