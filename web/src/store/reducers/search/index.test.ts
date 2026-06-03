import { describe, expect, test } from 'vitest'
import { actions, defaultState, reducers } from '.'

describe('searchStore', () => {
  describe('load', () => {
    test('Load initial state', () => {
      expect(reducers(undefined, actions.load())).toEqual(defaultState)
    })
  })

  describe('value', () => {
    test('should set value', () => {
      const content = {
        ...defaultState,
        value: 'Lorem ipsum',
      }

      expect(reducers(defaultState, actions.setValue('Lorem ipsum'))).toStrictEqual(content)
    })

    test('should reset value', () => {
      const content = {
        ...defaultState,
        value: '',
      }

      expect(reducers(defaultState, actions.setValue(''))).toStrictEqual(content)
    })

    test('should handle whitespace-only value', () => {
      const result = reducers(defaultState, actions.setValue('   '))

      expect(result.value).toBe('   ')
    })

    test('should handle special characters', () => {
      const special = '!@#$%^&*()_+'
      const result = reducers(defaultState, actions.setValue(special))

      expect(result.value).toBe(special)
    })
  })
})
