import { createStoreSelectors } from '@store/helper'
import { store } from '@store/reducers/reader'

export const readerSelector = createStoreSelectors(store)
