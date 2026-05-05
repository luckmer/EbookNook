import { IBookFile } from '@interfaces/book/interfaces'
import { createSelector } from '@reduxjs/toolkit'
import { bookSelector } from '@store/selectors/books'
import { searchSelector } from '@store/selectors/search'

export const booksState = createSelector([bookSelector.books], (books) =>
  Object.values(books)
    .flatMap((booksByFormat) => Object.values(booksByFormat))
    .filter((book) => !!book)
    .sort((a, b) => +a.createdAt - +b.createdAt)
    .map((book) => ({
      percentageProgress: book.percentageProgress,
      cover: book.metadata.cover,
      title: book.metadata.title,
      author: book.metadata.author,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
      format: book.format,
      id: book.id,
    }))
)

export const filteredBooks = createSelector(
  [booksState, searchSelector.value],
  (books, searchValue) => {
    if (!searchValue) return books

    const query = searchValue.toLowerCase()

    const acc: IBookFile[] = []

    books.forEach((book) => {
      if (book.title.toLowerCase().includes(query)) {
        acc.push(book)
      }
    })

    return acc
  },
)
