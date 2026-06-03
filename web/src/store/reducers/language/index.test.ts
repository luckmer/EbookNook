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

      expect(reducers(defaultState, actions.setLanguage(LANGUAGE.ENGLISH))).toStrictEqual(content)
    })

    test('Should set Polish', () => {
      const content = {
        ...defaultState,
        language: LANGUAGE.POLISH,
      }

      expect(reducers(defaultState, actions.setLanguage(LANGUAGE.POLISH))).toStrictEqual(content)
    })
  })
})
