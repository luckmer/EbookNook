import { createStoreSelectors } from '@store/helper'
import { store } from '@store/reducers/notes'

export const notesSelector = createStoreSelectors(store)
