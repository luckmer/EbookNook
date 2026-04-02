import { createStoreSelectors } from '@store/helper'
import { store } from '@store/reducers/notifications'

export const notificationsSelector = createStoreSelectors(store)
