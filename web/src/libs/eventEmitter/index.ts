import { EventEmitter } from './eventEmitterCore'

let _eventEmitter: EventEmitter | undefined

export const getEventEmitter = (): EventEmitter => {
  if (_eventEmitter) {
    return _eventEmitter
  }

  _eventEmitter = new EventEmitter()
  return _eventEmitter
}
