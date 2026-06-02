import { debounce } from '@utils/debounce'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

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
