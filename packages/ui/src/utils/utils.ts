export const getDate = (time: string) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const d = new Date(+time)

  return {
    day: d.getDate(),
    month: months[d.getMonth()].toLocaleLowerCase(),
    year: d.getFullYear(),
  }
}

export const getTime = (time: string) => {
  const d = new Date(+time)
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')

  const isAM = +h < 12

  return {
    hours: h,
    minutes: m,
    isAM,
  }
}

export const formatDate = (value: string) => {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 2) return numbers
  if (numbers.length <= 4) return `${numbers.slice(0, 2)}-${numbers.slice(2)}`
  return `${numbers.slice(0, 2)}-${numbers.slice(2, 4)}-${numbers.slice(4, 8)}`
}
