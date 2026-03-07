import { Annotation, Annotations } from '@bindings/annotations'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PayloadType } from '@store/helper'

export const annotationsStore = 'annotationsStore'

export interface IAnnotationsState {
  newAnnotationId: string
  annotations: Record<string, Annotations>
}

const defaultState: IAnnotationsState = {
  newAnnotationId: '',
  annotations: {},
}

export const store = createSlice({
  name: annotationsStore,
  initialState: defaultState,
  reducers: {
    setAnnotation(
      state,
      action: PayloadAction<{ id: string; annotation: Annotation; updateAnnotation?: boolean }>,
    ) {
      const { id, annotation, updateAnnotation } = action.payload

      if (updateAnnotation) {
        for (const key in state.annotations) {
          const index = state.annotations[key].findIndex((a) => a.id === annotation.id)

          if (index !== -1) {
            state.annotations[key][index] = annotation
            return state
          }
        }
        return state
      }

      if (!state.annotations[id]) {
        state.annotations[id] = []
      }

      state.annotations[id].push(annotation)
      return state
    },
    setCustomAnnotation(state, action: PayloadAction<{ id: string; annotation: Annotation }>) {
      if (!state.annotations[action.payload.id]) state.annotations[action.payload.id] = []
      state.annotations[action.payload.id].push(action.payload.annotation)
      return state
    },

    setAnnotations(state, action: PayloadAction<{ id: string; annotations: Annotations }>) {
      if (!state.annotations[action.payload.id]) state.annotations[action.payload.id] = []
      state.annotations[action.payload.id] = action.payload.annotations
      return state
    },
    setAnnotationId(state, action: PayloadAction<string>) {
      state.newAnnotationId = action.payload
      return state
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
      return state
    },
  },
})

export const reducers = store.reducer
export const actions = store.actions
export type PayloadTypes = PayloadType<typeof actions>
