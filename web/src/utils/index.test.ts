import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { debounce } from './debounce'
import { rstr2hex, sleep } from './index'

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

  describe('debounce', () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => vi.useRealTimers())

    test('calls function after delay', () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 500)

      debounced()
      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(500)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    test('resets the timer on each call', () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 500)

      debounced()
      vi.advanceTimersByTime(300)
      debounced()
      vi.advanceTimersByTime(300)

      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(200)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    test('clear cancels the pending call', () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 500)

      debounced()
      debounced.clear()
      vi.advanceTimersByTime(500)

      expect(fn).not.toHaveBeenCalled()
    })
  })
})
