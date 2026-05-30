import type { LOADER_STATUS } from './enums'

export type LoaderState =
  | { status: LOADER_STATUS.IDLE }
  | { status: LOADER_STATUS.LOADING }
  | { status: LOADER_STATUS.ERROR; error?: string }
  | { status: LOADER_STATUS.SUCCESS }
