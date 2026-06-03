import { describe, expect, test } from 'vitest'
import { actions, defaultState, reducers } from '.'

describe('settingsStore', () => {
  describe('load', () => {
    test('Load initial state', () => {
      expect(reducers(undefined, actions.load())).toEqual(defaultState)
    })
  })

  describe('setDefaultFontSize', () => {
    test('should set default font size', () => {
      const content = {
        ...defaultState,
        defaultFontSize: 16,
      }

      expect(reducers(defaultState, actions.setDefaultFontSize(16))).toStrictEqual(content)
    })

    test('should increase font size by 1', () => {
      const content = {
        ...defaultState,
        defaultFontSize: 17,
      }

      expect(reducers(defaultState, actions.setDefaultFontSize(17))).toStrictEqual(content)
    })

    test('should decrease font size by 1', () => {
      const content = {
        ...defaultState,
        defaultFontSize: 15,
      }

      expect(reducers(defaultState, actions.setDefaultFontSize(15))).toStrictEqual(content)
    })
  })

  describe('setFontWeight', () => {
    test('should set default font weight', () => {
      const content = {
        ...defaultState,
        fontWeight: 400,
      }

      expect(reducers(defaultState, actions.setFontWeight(400))).toStrictEqual(content)
    })

    test('should increase font weight by 100', () => {
      const content = {
        ...defaultState,
        fontWeight: 500,
      }

      expect(reducers(defaultState, actions.setFontWeight(500))).toStrictEqual(content)
    })

    test('should decrease font size by 100', () => {
      const content = {
        ...defaultState,
        fontWeight: 300,
      }

      expect(reducers(defaultState, actions.setFontWeight(300))).toStrictEqual(content)
    })
  })

  describe('setLetterSpacing', () => {
    test('should set default letter spacing', () => {
      const content = {
        ...defaultState,
        letterSpacing: 0,
      }

      expect(reducers(defaultState, actions.setLetterSpacing(0))).toStrictEqual(content)
    })

    test('should increase letter spacing by 1', () => {
      const content = {
        ...defaultState,
        letterSpacing: 1,
      }

      expect(reducers(defaultState, actions.setLetterSpacing(1))).toStrictEqual(content)
    })

    test('should decrease letter spacing by 1', () => {
      const content = {
        ...defaultState,
        letterSpacing: 0,
      }

      expect(reducers(defaultState, actions.setLetterSpacing(0))).toStrictEqual(content)
    })
  })

  describe('setTextIndent', () => {
    test('should set default text Indent', () => {
      const content = {
        ...defaultState,
        textIndent: 0,
      }

      expect(reducers(defaultState, actions.setTextIndent(0))).toStrictEqual(content)
    })

    test('should increase text Indent by 1', () => {
      const content = {
        ...defaultState,
        textIndent: 1,
      }

      expect(reducers(defaultState, actions.setTextIndent(1))).toStrictEqual(content)
    })

    test('should decrease text Indent by 1', () => {
      const content = {
        ...defaultState,
        textIndent: 0,
      }

      expect(reducers(defaultState, actions.setTextIndent(0))).toStrictEqual(content)
    })
  })

  describe('setLineHeight', () => {
    test('should set default line height', () => {
      const content = {
        ...defaultState,
        lineHeight: 1.5,
      }

      expect(reducers(defaultState, actions.setLineHeight(1.5))).toStrictEqual(content)
    })

    test('should increase line height by 1', () => {
      const content = {
        ...defaultState,
        lineHeight: 2.5,
      }

      expect(reducers(defaultState, actions.setLineHeight(2.5))).toStrictEqual(content)
    })

    test('should decrease line height by 1', () => {
      const content = {
        ...defaultState,
        lineHeight: 1.5,
      }

      expect(reducers(defaultState, actions.setLineHeight(1.5))).toStrictEqual(content)
    })
  })

  describe('setResetFontSettings', () => {
    test('should reset defaultFontSize and fontWeight to default values', () => {
      const content = {
        ...defaultState,
        defaultFontSize: 24,
        fontWeight: 700,
      }

      expect(reducers(defaultState, actions.setResetFontSettings())).toStrictEqual({
        ...content,
        defaultFontSize: 16,
        fontWeight: 400,
      })
    })
  })

  describe('setParagraphMargin', () => {
    test('should set default paragraph margin', () => {
      const content = {
        ...defaultState,
        paragraphMargin: 0,
      }

      expect(reducers(defaultState, actions.setParagraphMargin(0))).toStrictEqual(content)
    })

    test('should increase paragraph margin', () => {
      const content = {
        ...defaultState,
        paragraphMargin: 2.5,
      }

      expect(reducers(defaultState, actions.setParagraphMargin(2.5))).toStrictEqual(content)
    })

    test('should decrease paragraph margin', () => {
      const content = {
        ...defaultState,
        paragraphMargin: 1.5,
      }

      expect(reducers(defaultState, actions.setParagraphMargin(1.5))).toStrictEqual(content)
    })
  })

  describe('setResetLayoutSettings', () => {
    test('should reset wordSpacing, letterSpacing, paragraphMargin, textIndent and lineHeight to default values', () => {
      const content = {
        ...defaultState,
        wordSpacing: 10,
        letterSpacing: 5,
        paragraphMargin: 2.5,
        textIndent: 20,
        lineHeight: 2,
      }

      expect(reducers(defaultState, actions.setResetLayoutSettings())).toEqual({
        ...content,
        wordSpacing: 0,
        letterSpacing: 0,
        paragraphMargin: 0,
        textIndent: 0,
        lineHeight: 1.5,
      })
    })
  })
})
