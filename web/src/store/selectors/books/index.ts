import { createStoreSelectors } from '@store/helper'
import { store } from '@store/reducers/books'

export const booksSelector = createStoreSelectors(store)
