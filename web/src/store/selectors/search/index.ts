import { createStoreSelectors } from '@store/helper'
import { store } from '@store/reducers/search'

export const searchSelector = createStoreSelectors(store)
