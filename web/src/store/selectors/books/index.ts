import { createStoreSelectors } from '@store/helper'
import { store } from '@store/reducers/books'
import { createSelector } from '@reduxjs/toolkit'
import { IBook } from '@interfaces/book/interfaces'

export const bookSelector = createStoreSelectors(store)

export const booksMapSelector = createSelector(bookSelector.books, (books) => {
  const booksMap: Record<string, IBook> = {}

  for (const book of books) {
    booksMap[book.hash] = book
  }

  return booksMap
})
