import { LANGUAGE } from '@interfaces/language/enums'
import { describe, expect, test } from 'vitest'
import { actions, defaultState, reducers } from '.'

describe('languageStore', () => {
  describe('language', () => {
    test('Should set English', () => {
      const content = {
        ...defaultState,
        language: LANGUAGE.ENGLISH,
      }

      expect(reducers(content, actions.setLanguage(LANGUAGE.ENGLISH))).toBe(content)
    })

    test('Should set Polish', () => {
      const content = {
        ...defaultState,
        language: LANGUAGE.POLISH,
      }

      expect(reducers(content, actions.setLanguage(LANGUAGE.POLISH))).toBe(content)
    })
  })
})
