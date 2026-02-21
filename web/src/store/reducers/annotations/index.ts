import { Annotation, Annotations } from '@bindings/annotations'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PayloadType } from '@store/helper'

export const annotationsStore = 'annotationsStore'

export interface IAnnotationsState {
  annotations: Record<string, Annotations>
}

const defaultState: IAnnotationsState = {
  annotations: {},
}

export const store = createSlice({
  name: annotationsStore,
  initialState: defaultState,
  reducers: {
    setAnnotation(state, action: PayloadAction<{ id: string; annotation: Annotation }>) {
      if (!state.annotations[action.payload.id]) state.annotations[action.payload.id] = []
      state.annotations[action.payload.id].push(action.payload.annotation)
    },

    setAnnotations(state, action: PayloadAction<{ id: string; annotations: Annotations }>) {
      if (!state.annotations[action.payload.id]) state.annotations[action.payload.id] = []
      state.annotations[action.payload.id] = action.payload.annotations
    },
    getAnnotationStructure(state, _: PayloadAction<string>) {
      return state
    },
    deleteAnnotationById(state, action: PayloadAction<{ id: string; bookId: string }>) {
      const id = action.payload.id
      for (const key of Object.keys(state.annotations)) {
        const index = state.annotations[key].findIndex((a) => a.id === id)
        if (index !== -1) {
          state.annotations[key].splice(index, 1)
          break
        }
      }
    },
  },
})

export const reducers = store.reducer
export const actions = store.actions
export type PayloadTypes = PayloadType<typeof actions>
