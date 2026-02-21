import { ActionCreatorWithoutPayload, ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { createSelector, Selector } from 'reselect'

type StoreState<T> = {
  [K in keyof T]: T[K]
}

type StoreSelectors<T> = {
  [K in keyof T]: Selector<StoreState<T>, T[K]>
}

export type PayloadType<T> = {
  [K in keyof T]: T[K] extends ActionCreatorWithPayload<infer P>
    ? P
    : T[K] extends ActionCreatorWithoutPayload
      ? undefined
      : never
}

export const createStoreSelectors = <T extends Record<string, any>>(store: {
  getInitialState: () => T
  name: string
}): StoreSelectors<T> => {
  return Object.keys(store.getInitialState()).reduce((acc, k) => {
    acc[k as keyof T] = createSelector(
      (s: StoreState<T>) => s[store.name],
      (s: StoreState<T>) => s[k as keyof T],
    )
    return acc
  }, {} as StoreSelectors<T>)
}
