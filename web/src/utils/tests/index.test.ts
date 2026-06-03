import { describe, expect, test } from 'vitest'
import { rstr2hex, sleep } from '../index'

describe('web utils', () => {
  describe('sleep', () => {
    test('should sleep for 1 second', async () => {
      const start = Date.now()

      await sleep(1000)

      const end = Date.now()

      expect(end - start).toBeGreaterThanOrEqual(1000)
    })
    test('should sleep for 2 second', async () => {
      const start = Date.now()

      await sleep(2000)

      const end = Date.now()

      expect(end - start).toBeGreaterThanOrEqual(2000)
    })
  })

  describe('rstr2hex', () => {
    test('should convert string to hex', () => {
      expect(rstr2hex('hello')).toBe('68656c6c6f')
    })

    test('should convert empty string to empty string', () => {
      expect(rstr2hex('')).toBe('')
    })

    test('should handle special characters', () => {
      expect(rstr2hex('hello!#!@%#$')).toBe('68656c6c6f21232140252324')
    })
  })
})
