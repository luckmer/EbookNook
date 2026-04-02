import { IToast } from '@interfaces/notifications/interfaces'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PayloadType } from '@store/helper'

export const notificationStore = 'notificationStore'

export interface INotificationState {
  notifications: IToast[]
}

const defaultState: INotificationState = {
  notifications: [],
}

export const store = createSlice({
  name: notificationStore,
  initialState: defaultState,
  reducers: {
    load(state) {
      return state
    },
    setNotification(state, action: PayloadAction<IToast>) {
      const limit = 30
      if (state.notifications.length >= limit) state.notifications.pop()
      state.notifications = [action.payload, ...state.notifications]
      return state
    },
    dismissNotification(state, action: PayloadAction<number>) {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload,
      )
      return state
    },
  },
})

export const reducers = store.reducer
export const actions = store.actions
export type PayloadTypes = PayloadType<typeof actions>
