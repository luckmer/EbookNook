import { createStoreSelectors } from '@store/helper'
import { store } from '@store/reducers/bookmarks'

export const bookmarksSelector = createStoreSelectors(store)
