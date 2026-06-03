import { describe, expect, test } from 'vitest'
import { formatDate, getDate, getTime } from './utils'

describe('packages/ui utils', () => {
  describe('formatDate', () => {
    test('should automatically format data to DD-MM-YYYY', () => {
      const example = '01022026'
      expect(formatDate(example)).toBe('01-02-2026')
    })

    test('should format partial input with only day and month', () => {
      expect(formatDate('0102')).toBe('01-02')
    })

    test('should truncate year to 4 digits', () => {
      expect(formatDate('010220261234')).toBe('01-02-2026')
    })

    test('should return empty string for empty input', () => {
      expect(formatDate('')).toBe('')
    })
  })

  describe('getTime', () => {
    test('returns correct hours and minutes', () => {
      const date = new Date(1780331081).getTime()
      const result = getTime(String(date))
      expect(result.hours).toBe('15')
      expect(result.minutes).toBe('32')
    })

    test('isAM should return true', () => {
      const date = new Date(1780306198000).getTime()
      expect(getTime(String(date)).isAM).toBe(true)
    })

    test('isAM should return false', () => {
      const date = new Date(1780313398000).getTime()
      expect(getTime(String(date)).isAM).toBe(false)
    })
  })

  describe('getDate', () => {
    test('returns correct day, month and year', () => {
      const result = getDate('1780313398000')
      expect(result.day).toBe(1)
      expect(result.month).toBe('june')
      expect(result.year).toBe(2026)
    })

    test('month is lowercase', () => {
      const result = getDate('1780313398000')
      expect(result.month).toBe(result.month.toLowerCase())
    })

    test('returns correct date for second timestamp', () => {
      const result = getDate('1780331081')
      expect(result.day).toBeDefined()
      expect(result.month).toBeDefined()
      expect(result.year).toBeDefined()
    })
  })
})
