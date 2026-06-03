import { describe, expect, test } from 'vitest'
import { actions, defaultState, type IReaderLocation, reducers } from '.'

const subItems: Array<{
  id: number
  href: string
  label: string
}> = new Array(6).fill(0).map(() => ({
  href: 'epub30-overview.xhtml#sec-intro',
  id: 2,
  label: '1. Introduction',
}))

const readerLocation: IReaderLocation = {
  cfi: 'epubcfi(/6/4!/4/2/6)',
  fraction: 0,
  location: {
    current: 0,
    next: 0,
    total: 100,
  },
  time: {
    current: 0,
    total: 100,
  },
  tocItem: {
    href: 'epub30-overview.xhtml#sec-intro',
    label: '1. Introduction',
    id: 0,
    subitems: subItems,
  },
}

describe('readerStore', () => {
  describe('load', () => {
    test('Load initial state', () => {
      expect(reducers(undefined, actions.load())).toEqual(defaultState)
    })
  })

  describe('reset', () => {
    test('Reset initial state', () => {
      expect(reducers(undefined, actions.load())).toEqual(defaultState)
    })

    test('Reset initial state with reader location', () => {
      const stateWithReaderLocation = reducers(
        defaultState,
        actions.setReaderLocation(readerLocation),
      )

      expect(stateWithReaderLocation).toEqual({ ...defaultState, readerLocation })
      expect(reducers(stateWithReaderLocation, actions.reset())).toEqual(defaultState)
    })
  })

  describe('reset', () => {
    test('Set reader location', () => {
      expect(reducers(defaultState, actions.setReaderLocation(readerLocation))).toEqual({
        ...defaultState,
        readerLocation,
      })
    })

    test('Overwrites existing reader location', () => {
      const stateWithLocation = reducers(defaultState, actions.setReaderLocation(readerLocation))
      const updatedLocation = { ...readerLocation, cfi: 'epubcfi(/6/8!/4/2/4)' }
      const result = reducers(stateWithLocation, actions.setReaderLocation(updatedLocation))

      expect(result.readerLocation).toEqual(updatedLocation)
    })
  })
})
