import Book from '@components/Book'
import { IBook } from '@interfaces/book/interfaces'
import { FC, memo } from 'react'

export interface IProps {
  books: IBook[]
}

const BookShelf: FC<IProps> = ({ books }) => {
  return (
    <div className=" grid w-full grid-cols-[repeat(auto-fill,minmax(clamp(160px,16px,160px),1fr))] gap-12">
      {books.map((book, id) => (
        <Book key={id} img={book.metadata.cover} title={book.metadata.title} />
      ))}
    </div>
  )
}

export default memo(BookShelf)
