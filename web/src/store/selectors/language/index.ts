import { createStoreSelectors } from '@store/helper'
import { store } from '@store/reducers/language'

export const languageSelector = createStoreSelectors(store)
