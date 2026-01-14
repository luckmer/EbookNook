import { Book } from '@bindings/epub'
import { createSelector } from '@reduxjs/toolkit'
import { bookSelector } from '@store/selectors/books'
import { searchSelector } from '@store/selectors/search'

export const booksState = createSelector([bookSelector.books], (books) =>
  Object.values(books).flat()
)

export const filteredBooks = createSelector(
  [booksState, searchSelector.value],
  (books, searchValue) => {
    if (!searchValue) return books.map((b) => b.book)

    const query = searchValue.toLowerCase()

    return books.reduce((acc, bookWrapper) => {
      if (bookWrapper.book.title.toLowerCase().includes(query)) {
        acc.push(bookWrapper.book)
      }
      return acc
    }, [] as Book[])
  }
)
