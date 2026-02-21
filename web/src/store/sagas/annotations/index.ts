import { PayloadAction } from '@reduxjs/toolkit'
import { actions, PayloadTypes } from '@store/reducers/annotations'
import { actions as uiActions } from '@store/reducers/ui'
import { annotationsSelector } from '@store/selectors/annotations'
import { selectEpubMap } from '@store/selectors/books'
import { invoke } from '@tauri-apps/api/core'

import { all, call, put, select, takeEvery, takeLatest } from 'typed-redux-saga'

export function* getAnnotationStructure(
  action: PayloadAction<PayloadTypes['getAnnotationStructure']>,
) {
  const bookMap = yield* select(selectEpubMap)

  const book = bookMap[action.payload]

  if (!book) {
    yield* put(uiActions.setIsFetchingAnnotationsStructure(false))
    return
  }

  const annotations = yield* select(annotationsSelector.annotations)
  const booksAnnotations = annotations[action.payload] ?? []

  if (booksAnnotations.length > 0) {
    yield* put(uiActions.setIsFetchingAnnotationsStructure(false))
    return
  }

  try {
    const annotations = yield* call(invoke<any>, 'get_annotations_structure_by_id', {
      id: book?.book.id,
    })

    console.log('got data', annotations)
    yield* put(actions.setAnnotations({ id: action.payload, annotations }))
  } catch (err) {
    console.log('err', err)
  }

  yield* put(uiActions.setIsFetchingAnnotationsStructure(false))
}

export function* setAnnotation(action: PayloadAction<PayloadTypes['setAnnotation']>) {
  try {
    yield* call(invoke, 'add_annotation_structure', {
      annotation: action.payload.annotation,
      id: action.payload.id,
    })
  } catch (err) {
    console.log('err', err)
  }

  yield* put(uiActions.setIsFetchingStructure(false))
}

export function* deleteAnnotationById(action: PayloadAction<PayloadTypes['deleteAnnotationById']>) {
  try {
    yield* call(invoke, 'delete_annotation_by_id', {
      bookId: action.payload.bookId,
      id: action.payload.id,
    })
  } catch (err) {
    console.log('err', err)
  }
}

export function* getAnnotationStructureSaga() {
  yield* takeLatest(actions.getAnnotationStructure, getAnnotationStructure)
}

export function* setAnnotationSaga() {
  yield* takeEvery(actions.setAnnotation, setAnnotation)
}

export function* deleteAnnotationByIdSaga() {
  yield* takeEvery(actions.deleteAnnotationById, deleteAnnotationById)
}

export default function* RootSaga() {
  yield all([getAnnotationStructureSaga(), setAnnotationSaga(), deleteAnnotationByIdSaga()])
}
