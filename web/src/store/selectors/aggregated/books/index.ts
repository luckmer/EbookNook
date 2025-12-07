import { createSelector } from '@reduxjs/toolkit'
import { bookSelector } from '@store/selectors/books'
import { searchSelector } from '@store/selectors/search'

export const filteredBooks = createSelector(
  bookSelector.books,
  searchSelector.value,
  (books, value) => {
    return books.filter((book) => book.title.toLowerCase().includes(value.toLowerCase()))
  }
)
