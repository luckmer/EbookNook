import { createStoreSelectors } from '@store/helper'
import { store } from '@store/reducers/ui'

export const uiSelector = createStoreSelectors(store)
