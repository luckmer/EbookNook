import { Epub } from '@bindings/epub'
import { BookFormat } from '@interfaces/book/enums'
import { createSelector } from '@reduxjs/toolkit'
import { createStoreSelectors } from '@store/helper'
import { store } from '@store/reducers/books'

export const bookSelector = createStoreSelectors(store)

export const selectEpubMap = createSelector([bookSelector.books], (books) => {
  return books[BookFormat.EPUB].reduce((acc, item) => {
    acc[item.book.hash] = item
    return acc
  }, {} as Record<string, Epub | undefined>)
})
