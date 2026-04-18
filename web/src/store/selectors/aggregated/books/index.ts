import { IBookFile } from '@bindings/book'
import { createSelector } from '@reduxjs/toolkit'
import { bookSelector } from '@store/selectors/books'
import { searchSelector } from '@store/selectors/search'

export const booksState = createSelector([bookSelector.books], (books) =>
  Object.values(books).flat(),
)

export const filteredBooks = createSelector(
  [booksState, searchSelector.value],
  (books, searchValue) => {
    if (!searchValue) return books

    const query = searchValue.toLowerCase()

    return books.reduce((acc, book) => {
      const title = book.metadata.title

      const titleString = typeof title === 'string' ? title : Object.values(title).join(' ')

      if (titleString.toLowerCase().includes(query)) {
        acc.push(book)
      }

      return acc
    }, [] as IBookFile[])
  },
)
