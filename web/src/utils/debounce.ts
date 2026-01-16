export type ScheduleCallback = <Args extends unknown[]>(
  callback: (...args: Args) => void,
  wait?: number
) => Scheduled<Args>

export interface Scheduled<Args extends unknown[]> {
  (...args: Args): void
  clear: VoidFunction
}

export const debounce: ScheduleCallback = (callback, wait) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  const clear = () => clearTimeout(timeoutId)

  const debounced: typeof callback = (...args) => {
    if (timeoutId !== undefined) clear()
    timeoutId = setTimeout(() => callback(...args), wait)
  }
  return Object.assign(debounced, { clear })
}
