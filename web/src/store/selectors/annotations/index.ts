import { createStoreSelectors } from '@store/helper'
import { store } from '@store/reducers/annotations'

export const annotationsSelector = createStoreSelectors(store)
