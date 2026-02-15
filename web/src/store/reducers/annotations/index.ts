import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const annotationsStore = 'annotationsStore'

export interface IAnnotationsState {
  annotations: Record<string, string[]>
}

const defaultState: IAnnotationsState = {
  annotations: {},
}

export const store = createSlice({
  name: annotationsStore,
  initialState: defaultState,
  reducers: {
    setAnnotation(state, action: PayloadAction<{ id: string; annotation: string }>) {
      if (!state.annotations[action.payload.id]) state.annotations[action.payload.id] = []
      state.annotations[action.payload.id].push(action.payload.annotation)
    },
  },
})

export const reducers = store.reducer
export const actions = store.actions
