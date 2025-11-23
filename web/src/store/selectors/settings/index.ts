import { createStoreSelectors } from '@store/helper'
import { store } from '@store/reducers/settings'

export const settingsSelector = createStoreSelectors(store)
